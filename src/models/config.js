import { NpcModel } from "./actors/npc";
import { PlayerModel } from "./actors/player";
import { CombatModel, CombatantModel } from "./combat";

export function setupModels() {
    CONFIG.Actor.dataModels["player"] = PlayerModel;
    CONFIG.Actor.dataModels["npc"] = NpcModel;
    CONFIG.Combat.dataModels["base"] = CombatModel;
    CONFIG.Combatant.dataModels["base"] = CombatantModel;
}