import { DoomsongDataModel } from "../base.svelte";

const fields = foundry.data.fields;

const MoveField = () => new fields.SchemaField({
    name: new fields.StringField({ nullable: false, initial: "New Move" }),
    text: new fields.StringField({ nullable: false, initial: "Do something" }),
    // TODO: more attributes, such as check type, bonuses, etc
});

const MovesList = () => new fields.TypedObjectField(MoveField(), { nullable: false });

export class ActorModel extends DoomsongDataModel {
    // Some schema elements are consistent across all actor types. Define them here
    static defineSchema() {
        return {
            // Basic combat stats
            protection: new fields.NumberField({ nullable: false, integer: true, min: 0, initial: 0 }),
            toughness: new fields.SchemaField({
                // min: NumberField({ nullable: false, integer: true, min: 0, initial: 0 }), 
                max: new fields.NumberField({ nullable: false, integer: true, min: 0, initial: 0 }),
                value: new fields.NumberField({ nullable: false, integer: true, min: 0, initial: 0 }),
            }),
            footing: new fields.SchemaField({
                // min: NumberField({ nullable: false, integer: true, min: 0, initial: 0 }), 
                max: new fields.NumberField({ nullable: false, integer: true, min: 0, initial: 0 }),
                value: new fields.NumberField({ nullable: false, integer: true, min: 0, initial: 0 }),
            }),

            // Combat moves
            base_action_dice: new fields.NumberField({ nullable: false, integer: true, min: 1, initial: 1 }), // How many ya got, initially?
            // Each sub-array is the moves possible at that act, a simple object we'll expand later for more convenient automation
            moves: new fields.SchemaField({
                1: MovesList(),
                2: MovesList(),
                3: MovesList(),
                4: MovesList(),
                5: MovesList(),
                6: MovesList(),
            }),

            // Traits. Precede with + or ++ to make defined/super defined
            traits: new fields.TypedObjectField(
                new fields.SchemaField({
                    text: new fields.StringField({ nullable: false, initial: "New Trait" }),
                    level: new fields.NumberField({ nullable: false, integer: true, initial: 0, min: 0, max: 2 })
                }, { nullable: false }),
                { nullable: false }
            ),

            // Notes. Handy to have, might not keep forever
            notes: new fields.HTMLField({ nullable: false, initial: "Put notes here" })
        };
    }

    attack_difficulty = $derived(Math.max(this.toughness.value + this.protection, this.min_difficulty || 0));
    abilities = $derived(this.parent.items.filter(i => i.type == "ability"));

    // Migrations :/
    static migrateData(sourceData) {
        // Fix traits to be schema instead of + prefixed data
        for (let [tk, text] of Object.entries(sourceData.traits)) {
            if (typeof text == "string") {
                let level = [...text].filter(c => c == "+").length;
                text = text.replaceAll("+", "");
                sourceData.traits[tk] = {
                    level,
                    text
                }
            }
        }
    }
}
