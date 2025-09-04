import { ControlledLengthArrayField, DoomsongDataModel } from "../base";

const fields = foundry.data.fields;

const MoveField = () => new fields.SchemaField({
    name: new fields.StringField({ nullable: false, initial: "New Move"}),
    text: new fields.StringField({ nullable: false, initial: "Do something"}),
    // TODO: more attributes, such as check type, bonuses, etc
});

const MovesList = () => new fields.ArrayField(MoveField(), {nullable: false});

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

            // Descriptions etc
            traits: new fields.ArrayField(new fields.StringField({ nullable: false }))
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