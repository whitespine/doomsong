import { DoomsongChatMessage } from "../overrides/DoomsongChatMessage.svelte";
import { DoomsongActor } from "./actor";
import { DoomsongCombat, DoomsongCombatant } from "./combat";
import { DoomsongTokenDocument } from "./token";

export function setupDocuments() {
    // CONFIG.Item.documentClass = IconItem;
    CONFIG.Actor.documentClass = DoomsongActor;
    CONFIG.ChatMessage.documentClass = DoomsongChatMessage;
    // CONFIG.ActiveEffect.documentClass = LancerActiveEffect;
    CONFIG.Token.documentClass = DoomsongTokenDocument;
    CONFIG.Combat.documentClass = DoomsongCombat;
    CONFIG.Combatant.documentClass = DoomsongCombatant;

    CONFIG.Actor.trackableAttributes["player"] = {
        bar: ["footing_bar", "toughness_bar"],
        value: ["protection"]
    };
}

// Initializes tokens to by default display toughness/footing
export async function initTokenSettings() {
    return game.settings.set("core", "defaultToken", {
        displayName: 50,
        disposition: 0,
        displayBars: 50,
        bar1: {
            attribute: "footing_bar"
        },
        bar2: {
            attribute: "toughness_bar"
        }
    });
}