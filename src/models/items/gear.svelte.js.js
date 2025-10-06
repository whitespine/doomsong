import { DoomsongDataModel } from "../base.svelte";

const fields = foundry.data.fields;

export class GearModel extends DoomsongDataModel {
    // Some schema elements are consistent across all actor types. Define them here
    static defineSchema() {
        return {
            ...super.defineSchema(),
            // Basic item info
            bulk: new fields.NumberField({ nullable: false, integer: true, min: 0, initial: 0 }),
            stack_size: new fields.NumberField({ nullable: false, integer: true, min: 1, initial: 1}), // How many of this item fits in a stack (and then consumes burden). Usually 1
        };
    }
}
