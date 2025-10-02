import { formatDotpath } from "../utils/paths";

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

// Establish a shorthand
export const fields = foundry.data.fields;

export class DoomsongDataModel extends foundry.abstract.TypeDataModel {
  _configure(options={}) {
    super._configure(options);
    reactAllSchema(this);
  }
}

/**
 * Merge data, except it handles arrays in a more sane way than base mergeObject
 *
 * @param {object} target Object to modify 
 *
 * @param {object} source Object to pull from
 *
 * @returns {object} target
 */
export function fancyMerge(target, source) {
  if (target === null || target === undefined) {
    throw new Error("Cannot merge with null or undefined - try again");
  }
  if (
    typeof target === "number" ||
    typeof target === "string" ||
    typeof target === "boolean"
  ) {
    return source; // Handle in parent
  }
  for (let [k, v] of Object.entries(source)) {
    // Prepare for dotpath traversal
    k = formatDotpath(k);

    // Detect deletes
    const del = k.startsWith("-=");
    if (del) {
      k = k.slice(2);
    }

    // Detect dots
    const di = k.indexOf(".");
    if (di != -1) {
      if (del) {
        throw new Error("'-=' in dotpath must go at penultimate pathlet. E.x. 'system.whatever.-=val'");
      }

      // Dotpath - go recursive on that key
      const fore = k.slice(0, di);
      const aft = k.slice(di + 1);

      // Find existing value and branch on its existence
      const prior = target[fore];
      if (prior) {
        // Recursive
        target[fore] = fancyMerge(prior, { [aft]: v });
      } else {
        // New value at this location
        target[fore] = { [aft]: v };
      }
    } else {
      // Not a dotpath - assign/delete directly. Fairly trivial
      if (del) {
        if (Array.isArray(target)) {
          // Splice it
          target.splice(parseInt(k), 1);
        } else if (typeof target === "object") {
          // Delete it
          delete target[k];
        } else {
          // Unhandled type or nonexistant val
          console.warn("'-=' in update may only target Object or Array items");
        }
      } else {
        // Just assign it - simple as
        target[k] = v;
      }
    }
  }
  return target;
}

/**  
 * Handles an additional "length" option, and mandates that it remain at that length
 * If "overflow" option = truthy, then just forces there to be AT LEAST length
 */
export class ControlledLengthArrayField extends fields.ArrayField {
  // Constructor demands options
  constructor(element, options) {
    super(element, options);
    if (!Number.isInteger(options.length)) {
      throw new TypeError("ControlledLengthArrayField requires an integer 'length' option!");
    }
  }

  _cast(value) {
    value = super._cast(value);
    if (!Array.isArray(value)) {
      return value;
    } // Give up early

    // Extend or contract as appropriate
    while (value.length < this.options.length) {
      let new_elt = typeof this.element.initial == "function" ? this.element.initial() : this.element.initial;
      value.push(foundry.utils.duplicate(new_elt));
    }
    if (!this.options.overflow && value.length > this.options.length) {
      value = value.slice(0, this.options.length);
    }
    return value;
  }
}

/**
 * Calls options.cast on every value provided to this. 
 * Options.cast should be idempotent.
 */
export class CastingStringField extends fields.StringField {
  _cast(value) {
    value = super._cast(value);
    if (typeof this.options.cast === "function") {
      value = this.options.cast(value);
    }
    return value;
  }
}

/**
 * Capitalizes the first letter of each word in the provided string
 * 
 * @param {string} text Base text
 *
 * @returns text as title case
 */
export function titleCaseString(text) {
  return text
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
}