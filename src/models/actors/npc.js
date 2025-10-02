import { ActorModel } from "./actor.svelte";

const fields = foundry.data.fields;

export class NpcModel extends ActorModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),

            // Minimum difficulty for targeting. Could be a general modifier, but helps to codify
            min_difficulty: new fields.NumberField({ nullable: false, integer: true, min: 0, initial: 0 }),

            // Vibes. Just a string, comma separated
            vibes: new fields.StringField({ nullable: false, required: true, initial: "" }),


        }
    }
}