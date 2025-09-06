import { ControlledLengthArrayField, DoomsongDataModel } from "../base";

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
            toughness: new fields.NumberField({ nullable: false, integer: true, min: 0, initial: 0 }),
            max_toughness: new fields.NumberField({ nullable: false, integer: true, min: 0, initial: 0 }),
            protection: new fields.NumberField({ nullable: false, integer: true, min: 0, initial: 0 }),
            footing: new fields.NumberField({ nullable: false, integer: true, min: 0, initial: 0 }),
            max_footing: new fields.NumberField({ nullable: false, integer: true, min: 0, initial: 0 }),

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
            traits: new fields.ArrayField(
                new fields.StringField({ nullable: false, required: true, initial: "" },
                    { nullable: false }
                )
            ),

            // Abilities. Mostly geared towards players
            abilities: new fields.TypedObjectField(
                new fields.SchemaField({
                    name: new fields.StringField({ nullable: false, initial: "New Ability" }),
                    level: new fields.NumberField({ nullable: false, initial: 1, integer: true, min: 1 }), // Abilities start at level 1. Just correct based on index
                    level_text: new fields.ArrayField(
                        new fields.StringField({ nullable: false }),
                        {
                            nullable: false,
                            clean: (value) => (Array.isArray(value) && value.length == 0) ? value : ["Ability Text"] // Force to be at least length 1
                        }),
                    page: new fields.StringField({ nullable: false, initial: "DS:???" }),
                })
            )
        };
    }

    prepareDerivedData() {
        // Combat stats shared by all actors
        this.toughness_bar = {
            min: 0,
            max: this.max_toughness,
            value: this.toughness
        }
        this.footing_bar = {
            min: 0,
            max: this.max_footing,
            value: this.footing
        }
        this.attack_difficulty = Math.max(this.toughness + this.protection, this.min_difficulty || 0);
    }
}