import { NpcModel } from "./actors/npc";
import { PlayerModel } from "./actors/player";
import { CombatModel, CombatantModel } from "./combat";
import { AbilityModel } from "./items/ability.svelte";

export function setupModels() {
    CONFIG.Actor.dataModels["player"] = PlayerModel;
    CONFIG.Actor.dataModels["npc"] = NpcModel;
    CONFIG.Item.dataModels["ability"] = AbilityModel;
    CONFIG.Combat.dataModels["base"] = CombatModel;
    CONFIG.Combatant.dataModels["base"] = CombatantModel;
}