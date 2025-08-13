import { DoomsongChatMessage } from "../overrides/DoomsongChatMessage.svelte";
import { DoomsongActor } from "./actor";

export function setupDocuments() {
    // CONFIG.Item.documentClass = IconItem;
    CONFIG.Actor.documentClass = DoomsongActor;
    CONFIG.ChatMessage.documentClass = DoomsongChatMessage;
    // CONFIG.ActiveEffect.documentClass = LancerActiveEffect;
    // CONFIG.Token.documentClass = IconTokenDocument;

    CONFIG.Actor.trackableAttributes["player"] = {
        bar: ["footing", "toughness"],
        value: ["protection"]
    };
    // CONFIG.Actor.trackableAttributes["foe"] = {
        // bar: ["hp", "vigor"],
        // value: []
    // };
}