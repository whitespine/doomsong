import { DoomsongNPCSheet, DoomsongPlayerSheet } from "./ActorSheet";
import { DoomsongAbilitySheet, DoomsongArmorSheet, DoomsongGearSheet, DoomsongWeaponSheet } from "./ItemSheet";

export function setupSheets() {
    foundry.documents.collections.Actors.unregisterSheet("core", foundry.applications.sheets.ActorSheetV2);
    // Actors.registerSheet(game.system.id, )
    foundry.documents.collections.Actors.registerSheet(game.system.id, DoomsongNPCSheet, { types: ["npc"], makeDefault: true });
    foundry.documents.collections.Actors.registerSheet(game.system.id, DoomsongPlayerSheet, { types: ["player"], makeDefault: true });
    foundry.documents.collections.Items.registerSheet(game.system.id, DoomsongAbilitySheet, { types: ["ability"], makeDefault: true });
    foundry.documents.collections.Items.registerSheet(game.system.id, DoomsongWeaponSheet, { types: ["weapon"], makeDefault: true });
    foundry.documents.collections.Items.registerSheet(game.system.id, DoomsongArmorSheet, { types: ["armor"], makeDefault: true });
    foundry.documents.collections.Items.registerSheet(game.system.id, DoomsongGearSheet, { types: ["gear"], makeDefault: true });
}