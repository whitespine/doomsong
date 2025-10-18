import { ActorModel } from "./actor.svelte";
import PlayerDefaultMoves from "./player_moves.json"

const fields = foundry.data.fields;

export class PlayerModel extends ActorModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),

            // Names - there are three!
            birth_name: new fields.StringField({ initial: "" }),
            player_name: new fields.StringField({ initial: "" }),
            nickname: new fields.StringField({ initial: "" }),

            // XP tracking
            goal: new fields.StringField({ initial: "" }),
            xp: new fields.NumberField({ initial: 0, min: 0, max: 10 }),

            // Wycce Shit
            heresy: new fields.StringField({ initial: "" }),
            vow: new fields.StringField({ initial: "" }),

            // Biography - todo
            biography: new fields.HTMLField({ initial: "Put bio here" }),

            // Total bulk we can carry
            ready_capacity: new fields.NumberField({ integer: true, initial: 6 }),
            stowed_capacity: new fields.NumberField({ integer: true, initial: 12 })
        }
    }

    async _preCreate(data, options, user) {
        await super._preCreate(data, options, user);

        let mods = {
            base_action_dice: 2 // Players are "major"
        };
        // Add default moves
        if (!data["moves"]) {
            mods["moves"] = PlayerDefaultMoves;
        }

        // Put in the basics
        this.updateSource(mods);
    }

    prepareDerivedData() {
        this.ready_load = 0;
        this.stowed_load = 0;
        for(let item of this.parent.items.contents) {
            if(!["gear", "weapon", "armor"].includes(item.type)) continue;
            if(!Number.isInteger(item.system.bulk)) continue;
            if(item.system.ready) {
                this.ready_load += item.system.bulk;
            } else {
                this.stowed_load += item.system.bulk;
            }
        }
    }

}