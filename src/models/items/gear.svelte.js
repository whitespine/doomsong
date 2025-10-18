import { ItemModel } from "./item.svelte";

const fields = foundry.data.fields;

export class GearModel extends ItemModel {
    // Some schema elements are consistent across all actor types. Define them here
    static defineSchema() {
        return {
            // Basic item info
            bulk: new fields.NumberField({ integer: true, min: 0, initial: 1 }), // How much space does this take up
            // stack_size: new fields.NumberField({ integer: true, min: 1, initial: 1 }), // How many of this item fits in a stack (and then consumes burden). Usually 1
            // quantity: new fields.NumberField({ nullable: true, integer: true, min: 1, initial: null }), // How many of this item do we have (and then consumes burden). Usually 1. Null implies "infinite"

            // If true, consider this gear "ready"
            ready: new fields.BooleanField({ initial: true })
        };
    }
}
