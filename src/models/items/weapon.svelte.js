import { GearModel } from "./gear.svelte";

const fields = foundry.data.fields;

export class WeaponModel extends GearModel {
    // Some schema elements are consistent across all actor types. Define them here
    static defineSchema() {
        return {
            ...super.defineSchema(),
            attack_type: new fields.StringField({ 
                initial: "attack_b", 
                nullable: false, 
                validateType: (v) => ["attack_b", "attack_i", "attack_p", "attack_s"].includes(v)
            })
            // heavy: new fields.BooleanField({ initial: false, nullable: false })
        };
    }
}
