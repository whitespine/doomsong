import { ActorModel } from "./actor";


export class NpcModel extends ActorModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),
        }
    }
}