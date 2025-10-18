import { RollerApp } from "../../apps/roll_app.svelte";
import { GearModel } from "./gear.svelte";

const fields = foundry.data.fields;

export class WeaponModel extends GearModel {
    // Some schema elements are consistent across all actor types. Define them here
    static defineSchema() {
        return {
            ...super.defineSchema(),
            attack_type: new fields.StringField({
                initial: "attack_i",
                validateType: (v) => ["attack_b", "attack_i", "attack_p", "attack_s"].includes(v)
            }),
            tags: new fields.StringField({ initial: "" })
            // heavy: new fields.BooleanField({ initial: false, nullable: false })
        };
    }

    // Begin an attack flow with this weapon
    beginAttack() {
        if (!this.parent.actor) return ui.notifications.error("Not currently supported to attack with an unowned weapon");
        RollerApp.prompt(this.parent.actor, {
            roll: {
                roll_type: this.attack_type
                // TODO: more pre-sets based on tags or something
            }
        });
    }
}
