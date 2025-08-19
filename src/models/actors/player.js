import { ActorModel } from "./actor";
import PlayerDefaultMoves from "./player_moves.json"


export class PlayerModel extends ActorModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),
        }
    }

 async _preCreate(data, options, user) {
        await super._preCreate(data, options, user);

        let mods = {};
        // Add default moves
        if(!data["moves"]) {
            mods["moves"] = PlayerDefaultMoves;
        }

        // Put in the basics
        this.updateSource(mods);
    }

}