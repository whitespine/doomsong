import { DOOMSONG } from "../consts";
import { AttackFlowApp } from "../apps/dodge_prompt.svelte";
import { onReceiveSuspense } from "./suspense.svelte";

/**
 * Setup function for socket events
 */
export function initNetworkedSuspense() {
    game.socket.on(`${game.system.id}.${DOOMSONG.socket.suspense}`, onReceiveSuspense);
}

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