import { ActorModel } from "./actor";

const fields = foundry.data.fields;

export class NpcModel extends ActorModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),
            min_difficulty: new fields.NumberField({ nullable: false, integer: true, min: 0, initial: 0 }),
        }
    }
}