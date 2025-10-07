import { ActorModel } from "./actor.svelte";
import PlayerDefaultMoves from "./player_moves.json"

const fields = foundry.data.fields;

export class PlayerModel extends ActorModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),

            // Names - there are three!
            birth_name: new fields.StringField({ nullable: false, required: true, initial: "" }),
            player_name: new fields.StringField({ nullable: false, required: true, initial: "" }),
            nickname: new fields.StringField({ nullable: false, required: true, initial: "" }),

            // XP tracking
            goal: new fields.StringField({ nullable: false, required: true, initial: "" }),
            xp: new fields.NumberField({ nullable: false, required: true, initial: 0, min: 0, max: 10 }),

            // Wycce Shit
            heresy: new fields.StringField({ nullable: false, required: true, initial: "" }),
            vow: new fields.StringField({ nullable: false, required: true, initial: "" }),

            // Biography - todo
            biography: new fields.HTMLField({ nullable: false, required: true, initial: "Put bio here" }),

            // Total bulk we can carry
            ready_load: new fields.NumberField({nullable: false, integer: true, initial: 6}),
            stowed_load: new fields.NumberField({nullable: false, integer: true, initial: 12})
        }
    }

 async _preCreate(data, options, user) {
        await super._preCreate(data, options, user);

        let mods = {
            base_action_dice: 2 // Players are "major"
        };
        // Add default moves
        if(!data["moves"]) {
            mods["moves"] = PlayerDefaultMoves;
        }

        // Put in the basics
        this.updateSource(mods);
    }

}