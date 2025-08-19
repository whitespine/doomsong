import { ActorModel } from "./actor";


export class PlayerModel extends ActorModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),
        }
    }
}