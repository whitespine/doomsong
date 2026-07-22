import { DOOMSONG } from "../consts";
import { AttackFlowApp } from "../apps/dodge_prompt.svelte";
import { onReceiveSuspense } from "./suspense.svelte";
import { onReceiveSetDoom } from "../components/doomcoin/doomcoin_tracker";

export function initSockets() {
    game.socket.on(`system.${game.system.id}`, (data) => {
        let { type, payload } = data;
        switch (type) {
            case DOOMSONG.socket.suspense:
                onReceiveSuspense(payload)
                break;
            case DOOMSONG.socket.attack:
                AttackFlowApp.showFlow(payload)
                break;
            case DOOMSONG.socket.doom: 
                onReceiveSetDoom(payload);
                break;
            default:
                ui.notifications.warn(`Unhandled doomsong event type ${type}`);
        }
    });
}

/**
 * 
 * @param {string} type The message type. Use something from DOOMSONG.socket
 * @param {any} payload Arbitrary json data
 * @returns {Promise<any>}
 */
export function sendSocket(type, payload) {
    return game.socket.emit(`system.${game.system.id}`, {
        type,
        payload
    });
}