import { NpcModel } from "./actors/npc";
import { PlayerModel } from "./actors/player";
import { CombatModel, CombatantModel } from "./combat";
import { AbilityModel } from "./items/ability.svelte";
import { ArmorModel } from "./items/armor.svelte";
import { GearModel } from "./items/gear.svelte";
import { WeaponModel } from "./items/weapon.svelte";

export function setupModels() {
    CONFIG.Actor.dataModels["player"] = PlayerModel;
    CONFIG.Actor.dataModels["npc"] = NpcModel;
    CONFIG.Item.dataModels["ability"] = AbilityModel;
    CONFIG.Item.dataModels["gear"] = GearModel;
    CONFIG.Item.dataModels["weapon"] = WeaponModel;
    CONFIG.Item.dataModels["armor"] = ArmorModel;
    CONFIG.Combat.dataModels["base"] = CombatModel;
    CONFIG.Combatant.dataModels["base"] = CombatantModel;
}