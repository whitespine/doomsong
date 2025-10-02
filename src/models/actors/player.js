import { ActorModel } from "./actor.svelte";
import PlayerDefaultMoves from "./player_moves.json"


export class PlayerModel extends ActorModel {
    static defineSchema() {
        return {
            ...super.defineSchema(),
        }
    }

 async _preCreate(data, options, user) {
        await super._preCreate(data, options, user);

        let mods = {
            base_action_dice: 2 // Players are "major"
        };
        // Add default moves
        if(!data["moves"]) {
            mods["moves"] = PlayerDefaultMoves;
        }

        // Put in the basics
        this.updateSource(mods);
    }

}