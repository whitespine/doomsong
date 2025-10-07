import { GearModel } from "./gear.svelte";

const fields = foundry.data.fields;

export class ArmorModel extends GearModel {
    // Some schema elements are consistent across all actor types. Define them here
    static defineSchema() {
        return {
            ...super.defineSchema(),
            // Basic item info
            protection: new fields.NumberField({ initial: 2, nullable: false, integer: true, min: 1 })
        };
    }
}
