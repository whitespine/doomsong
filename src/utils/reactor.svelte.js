/**
 * Inject reactivity into various core document fields
 */

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
	if(!(sk in object)) {
		object[sk] = new Statelet(initial_value); 
	}
	return object[sk];
}

// Call during a _configure to inject a Statelet and appropriate getters and setters, to make any field reactive
// initial_value does not really matter
export function injectReactive(object, key, initial_value=null) {
	let sk = stateletKey(key);
	Object.defineProperty(object, key, {
	  get: function() { return safeGetStatelet(object, sk, initial_value).value },
		set: function(v) { safeGetStatelet(object, sk, initial_value).value = v }
	});
}

// Shorthand for reacting to all in a DataModel's schema
export function reactAllSchema(object) {
  for(let key of object.schema.keys()) {
    injectReactive(object, key);
  }
}


// A setup of global injects
const injects = [
    {
        target: User,
        keys: ["name"] // Color doesn't quite work because it is an extension of a subclass of Number. Confusing
    }, {
        target: Actor,
        keys: ["name", "img"]
    }
];

// Hijacks the configure function on a predefined set of core documents to be reactive
export function injectAllCoreDocuments() {
    for(let inject of injects) {
        const original_configure = inject.target.prototype._configure;
        inject.target.prototype._configure = function (options={}) {
            const original_this = this;
            original_configure.call(original_this, options);

            // Then do injects
            for(let key of inject.keys) {
                injectReactive(original_this, key);
            }
        }
    }
}

// Monkeypatches
export function injectCollections() {
        const orig_onModifyContents = Collection.prototype._onModifyContents;
        Collection.prototype._onModifyContents = function (options={}) {
            const original_this = this;
            original_configure.call(original_this, options);

            // Then do injects
            for(let key of inject.keys) {
                injectReactive(original_this, key);
            }
        }
}

/**
 * Rather than modify collections directly, monkey patch in modification to perhaps either _onModifyContents or to _initialize
 * to also trigger a synchronization of a state rune (possibly housed in a statelet)
 */