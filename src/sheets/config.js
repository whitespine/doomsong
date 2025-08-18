import { DoomsongNPCSheet } from "./NPCSheet";

export function setupSheets() {
    Actors.unregisterSheet("core", ActorSheet);
    // Actors.registerSheet(game.system.id, )
    Actors.registerSheet(game.system.id, DoomsongNPCSheet, { types: ["npc"], makeDefault: true });
}