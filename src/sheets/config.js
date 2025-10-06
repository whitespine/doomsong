import { DoomsongNPCSheet } from "./NPCSheet";
import { DoomsongPlayerSheet } from "./PlayerSheet";

export function setupSheets() {
    foundry.documents.collections.Actors.unregisterSheet("core", foundry.applications.sheets.ActorSheetV2);
    // Actors.registerSheet(game.system.id, )
    foundry.documents.collections.Actors.registerSheet(game.system.id, DoomsongNPCSheet, { types: ["npc"], makeDefault: true });
    foundry.documents.collections.Actors.registerSheet(game.system.id, DoomsongPlayerSheet, { types: ["player"], makeDefault: true });
}