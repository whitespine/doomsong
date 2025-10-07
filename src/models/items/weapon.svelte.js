import { GearModel } from "./gear.svelte";

const fields = foundry.data.fields;

export class WeaponModel extends GearModel {
    // Some schema elements are consistent across all actor types. Define them here
    static defineSchema() {
        return {
            ...super.defineSchema(),
            heavy: new fields.BooleanField({ initial: false, nullable: false })
        };
    }
}
