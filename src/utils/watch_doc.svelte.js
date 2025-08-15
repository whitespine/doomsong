
import {writeable} from "svelte/store";
// Utilities for watching objects for updates, using svelte 5 runes

// Map [uuid] -> WeakSet<writeable<doc>>
let watches = new Map();
let set_hooks = new Set();

class IterableWeakSet {
    // For now - just wrap a set
    constructor() {
        this.inner = new Set();
    }

    // Add an item. Automatically cleaned up via weakref (TODO)
    add(item) {
        this.inner.add(item);
    }

    // You can't for let of, so do this instead. Call on each item we keep a reference to
    each(lambda) {
        for(let x of this.inner) {
            lambda(x);
        }
    }
}

// Create a store around a document that updates whenever the document updates
export function watch(document) {
    // Check if we need to set a hook
    let document_name = document.documentName;
    if(!set_hooks.has(document_name)) {
        Hooks.on(`update${document_name}`, (doc, delta, _meta) => {
            let relevant_stores = watches.get(doc.uuid);
            if(relevant_stores) {
                // Just reset with the same doc. Will trigger reactivity
                relevant_stores.each((x) => x.set(doc));
            }
        });
        // We're henceforth all good
        set_hooks.add(document_name);
    }

    // Get our current array, creating it if necessary
    let set = watches.get(document.uuid) || new IterableWeakSet();

    // Create the writeable
    let store = writeable(document);
    set.add(store);

    // Make sure we save the watch if this is the first time the array has been 
    watches.set(document.uuid, set);
    return set;
}