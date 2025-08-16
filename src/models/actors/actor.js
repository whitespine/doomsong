import { ControlledLengthArrayField, DoomsongDataModel } from "../base";

export const fields = foundry.data.fields;

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
            // A fixed length array of arrays. Each sub-array is the actions possible at that act
            moves: new ControlledLengthArrayField(
                new fields.ArrayField(
                    new fields.StringField({ nullable: false})
                )
            , {nullable: false, length: 6}),

            // Descriptions etc
            traits: new fields.ArrayField(new fields.StringField({ nullable: false }))
        };
    }
}