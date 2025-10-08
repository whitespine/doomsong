import { DoomsongChatMessage } from "../overrides/DoomsongChatMessage.svelte";
import { DoomsongActor } from "./actor.svelte";
import { DoomsongCombat, DoomsongCombatant } from "./combat";
import { DoomsongItem } from "./item.svelte";
import { DoomsongToken, DoomsongTokenDocument } from "./token";

export function setupDocuments() {
    // CONFIG.Item.documentClass = IconItem;
    CONFIG.Actor.documentClass = DoomsongActor;
    CONFIG.Item.documentClass = DoomsongItem;
    CONFIG.ChatMessage.documentClass = DoomsongChatMessage;
    // CONFIG.ActiveEffect.documentClass = LancerActiveEffect;
    CONFIG.Token.documentClass = DoomsongTokenDocument;
    CONFIG.Token.objectClass = DoomsongToken;
    CONFIG.Combat.documentClass = DoomsongCombat;
    CONFIG.Combatant.documentClass = DoomsongCombatant;

    CONFIG.Actor.trackableAttributes["player"] = {
        bar: ["footing", "toughness"],
        value: ["protection"]
    };
}

// Initializes combat tracker to have a pretty flashing pulse under them
export async function initCombatSettings() {
    return game.settings.set("core", "combatTrackerConfig", {
        turnMarker: {
            enabled: true,
            animation: "pulse",
            src: "systems/doomsong/assets/icons/sign_of_the_crossroads.png",
            disposition: false
        }, resource: "", skipDefeated: false
    });
}