import { DoomsongNPCSheet } from "./NPCSheet";

export function setupSheets() {
    foundry.documents.collections.Actors.unregisterSheet("core", foundry.applications.sheets.ActorSheetV2);
    // Actors.registerSheet(game.system.id, )
    foundry.documents.collections.Actors.registerSheet(game.system.id, DoomsongNPCSheet, { types: ["npc"], makeDefault: true });
}