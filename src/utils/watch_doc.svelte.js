
// Utilities for watching objects for updates, using svelte 5 runes

// Map [uuid] -> WeakSet<writeable<doc>>
let watches = new Map();
let set_hooks = new Set();

class IterableWeakArray {
    constructor() {
        this.inner = [];
    }

    // Add an item. Automatically cleaned up via weakref (TODO)
    add(item) {
        this.inner.add(new WeakRef(item));
    }

    // Force it to an array
    toArray() {
        let result = [];
        for (let x of this.inner) {

        }

        return ...new_inner;
    }
}

// Create a store around a document that updates whenever the document updates
function watch(doc) {
    // Check if we need to set a hook
    /*
    let document_name = doc.documentName;
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
    let set = watches.get(doc.uuid) || new IterableWeakArray();

    // Create the writeable
    let store = writeable(doc);
    set.add(store);

    // Make sure we save the watch if this is the first time the array has been 
    watches.set(doc.uuid, set);
    return set;
    const handler = {
        get(target, prop, receiver) {
            if (prop === "message2") {
                return "world";
            }
            return Reflect.get(target, prop, receiver);
        },
    };

    proxy3 = new Proxy(target, handler3);

    console.log(proxy3.message1); // hello
    console.log(proxy3.message2); // world
    */
   return j
}

// Wraps access to a document in a raw binding
export class WatchDoc {
    // Our inner reference
    #_doc = null;

    // And our exterior, observable state
    doc = $state.raw(null);

    static #id_counter = 1;

    constructor(doc) {
        this.id = `watch${WatchDoc.#id_counter++}`;
        this.#_doc = doc;
        this.doc = this.#_doc;
    }

    // Update `doc` whenever a render happens
    // render(force, options) {
    render(..._args) {
        // force an invalidation
        this.doc = null;
        this.doc = this.#_doc;
    }

    // Attach this watchdoc and make it start receiving render events
    attach() {
        this.doc.apps[this.id] = this;
        return this;
    }

    // Detach this watchdoc and make it stop receiving render events
    detach() {
        delete this.doc.apps[this.id];
        return this;
    }
}


export class WatchNested