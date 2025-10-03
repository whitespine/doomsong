/**
 * Inject reactivity into various core document fields
 */

import { SvelteMap } from "svelte/reactivity";

// Simple wrapper around a single svelte state
class Statelet {
    constructor(initial) {
        this.value = $state(initial);
    }
}

// Add getters and setters for a statelet
function stateletKey(key) {
    return `_STATELET__${key}`;
}

// Get a statelet, or initialize+grab it if not yet assigned
function safeGetStatelet(object, sk, initial_value) {
    if (!(sk in object)) {
        object[sk] = new Statelet(initial_value);
    }
    return object[sk];
}

// Call during a _configure to inject a Statelet and appropriate getters and setters, to make any field reactive
// initial_value does not really matter
export function injectReactive(object, key, hidden_key=null) {
    let sk = hidden_key ?? stateletKey(key);
    Object.defineProperty(object, key, {
        get: function () { return safeGetStatelet(object, sk, null).value },
        set: function (v) { safeGetStatelet(object, sk, null).value = v }
    });
}

// Shorthand for reacting to all in a DataModel's schema
export function reactAllSchema(object) {
    for (let key of object.schema.keys()) {
        injectReactive(object, key);
    }
}


// A setup of global injects
const CORE_INJECTS = [
    {
        target: User,
        keys: ["name"] // Color doesn't quite work because it is an extension of a subclass of Number. Confusing
    }, {
        target: Actor,
        keys: ["name", "img", "system"]
    }, {
        target: Combat,
        keys: []
    }, {
        target: Combatant,
        keys: ["name", "img"]
    }
];

// Hijacks the configure function on a predefined set of core documents to be reactive
export function injectAllCoreDocumentsReactivity() {
    for (let inject of CORE_INJECTS) {
        const original_configure = inject.target.prototype._configure;
        inject.target.prototype._configure = function (options = {}) {
            const original_this = this;
            original_configure.call(original_this, options);

            // Then do injects
            for (let key of inject.keys) {
                injectReactive(original_this, key);
            }
        }
    }
}

// Monkeypatches EmbeddedCollection to have and maintain a `.svelte` map of instantiated documents
export function injectEmbeddedCollectionsReactivity() {
    const origInitialize = foundry.abstract.EmbeddedCollection.prototype.initialize;
    foundry.abstract.EmbeddedCollection.prototype.initialize = function (options = {}) {
        const original_this = this;
        origInitialize.call(original_this, options);

        // Setup reactive map if we haven't
        if(!("svelte" in this)) { this.svelte = new SvelteMap(); }

        // Get all records we have initialized
        const initializedIds = new Set();
        for (const [id, doc] of this.entries()) {
            if (doc) initializedIds.add(id);
        }

        // Sync our internal svelte reactive map - first delete what was removed from "this"
        if (this.svelte.size !== initializedIds.size) {
            for (const k of this.svelte.keys()) {
                if (!initializedIds.has(k)) {
                    this.svelte.delete(k);
                }
            }
        }
        // Then add what is missing from this.svelte
        if (this.svelte.size !== initializedIds.size) {
            for (const k of initializedIds) {
                if (!this.svelte.has(k)) {
                    this.svelte.set(k, this.get(k));
                }
            }
        }
    }
}

/**
 * Rather than modify collections directly, monkey patch in modification to perhaps either _onModifyContents or to _initialize
 * to also trigger a synchronization of a state rune (possibly housed in a statelet)
 */