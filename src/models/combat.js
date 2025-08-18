import { ControlledLengthArrayField, DoomsongDataModel } from "./base";

export const fields = foundry.data.fields;

export class CombatModel extends DoomsongDataModel {
    // Some schema elements are consistent across all actor types. Define them here
    static defineSchema() {
        return {
            // Currently set out action dice
            phase: new fields.StringField({
                nullable: false,
                initial: "begin",
                choices: ["begin", "set", "acts", "retreat", "end"]
            }),
            act: new fields.NumberField({ nullable: false, integer: true, min: 1, initial: 1, max: 6})
        };
    }
}

export class CombatantModel extends DoomsongDataModel {
    // Some schema elements are consistent across all actor types. Define them here
    static defineSchema() {
        return {
            // Currently set out action dice
            set_dice: new fields.ArrayField(new fields.NumberField({
                nullable: false,
                integer: true,
                min: 1,
                initial: 1,
                max: 6
            }), {
                nullable: false,
            }),

            // Current owned action dice. Can be lost or gained via resisting [death], initially just 2 for
            available_dice: new fields.NumberField({ nullable: false, integer: true, min: 1, initial: 2, max: 2 }), 
        };
    }
}