import { DoomsongActor } from "./actor";

export function setupDocuments() {
    // CONFIG.Item.documentClass = IconItem;
    CONFIG.Actor.documentClass = DoomsongActor;
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