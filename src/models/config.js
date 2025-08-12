import { NpcModel } from "./actors/npc";
import { PlayerModel } from "./actors/player";

export function setupModels() {
    // Setup models
    // CONFIG.Item.dataModels["relic"] = RelicModel;

    CONFIG.Actor.dataModels["player"] = PlayerModel;
    CONFIG.Actor.dataModels["npc"] = NpcModel;
}