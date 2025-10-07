import { ItemModel } from "./item.svelte";

const fields = foundry.data.fields;

export class GearModel extends ItemModel {
    // Some schema elements are consistent across all actor types. Define them here
    static defineSchema() {
        return {
            // Basic item info
            bulk: new fields.NumberField({ nullable: false, integer: true, min: 0, initial: 0 }), // How much space does this take up
            stack_size: new fields.NumberField({ nullable: false, integer: true, min: 1, initial: 1 }), // How many of this item fits in a stack (and then consumes burden). Usually 1

            // If true, consider this gear "ready"
            ready: new fields.BooleanField({ nullable: false, initial: true })
        };
    }
}
