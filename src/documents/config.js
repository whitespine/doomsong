import { DoomsongChatMessage } from "../overrides/DoomsongChatMessage.svelte";
import { DoomsongActor } from "./actor.svelte";
import { DoomsongCombat, DoomsongCombatant } from "./combat";
import { DoomsongToken, DoomsongTokenDocument } from "./token";

export function setupDocuments() {
    // CONFIG.Item.documentClass = IconItem;
    CONFIG.Actor.documentClass = DoomsongActor;
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

// Initializes tokens to by default display toughness/footing
export async function initTokenSettings() {
    return game.settings.set("core", "defaultToken", {
        displayName: 50,
        disposition: 0,
        displayBars: 50,
        bar1: {
            attribute: "footing"
        },
        bar2: {
            attribute: "toughness"
        }
    });
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