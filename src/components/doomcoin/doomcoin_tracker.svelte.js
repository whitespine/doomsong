import skull from "$assets/icons/skull.png";
import { DOOMSONG } from "../../consts";
import { warnOnNoGM } from "../../utils/ownership";
import { sendSocket } from "../../utils/socket.svelte";

export function initDoomRenderHook() {
    Hooks.on("renderPlayers", (_players, element, context, _options) => {
        // GM's are never doomed
        doomed_actor = null;
        for(let user of game.users.contents) {
            if(user.isGM) continue;
            let doomed = getUserDoomState(user);
            if(doomed) { 
                doomed_actor = user.character;
                if(!user.active) continue;
                let doomed_user_li = element.querySelector(`[data-user-id=${user._id}]`);
                let doomcoin_elt = document.createElement("img");
                doomcoin_elt.src = skull;
                doomcoin_elt.style = "max-width: 32px; max-height: 32px; background-color: white; border-radius: 16px";
                doomcoin_elt.dataset.tooltip = "Doomed!";
                doomed_user_li.appendChild(doomcoin_elt);
            }
        }
    });

    const re_render_trigger = (effect) => {
        if(effect.statuses.has("doomed")) {
            ui.players.render({force: true});
        }
    }

    Hooks.on("createActiveEffect", re_render_trigger);
    Hooks.on("deleteActiveEffect", re_render_trigger);
}

/** Check if a user is doomed
 * 
 * @param {User} user 
 * @returns {boolean} If they are doomed
 */
export function getUserDoomState(user) {
    return user.character ? getActorDoomState(user.character) : false;
}

export function getActorDoomState(actor) {
    return actor.effects.some(s => s.statuses.has("doomed"));
}

let doomed_actor = $state(null);
export function getDoomedActor() {
    return doomed_actor;
}

/** Set if a character is doomed
 * 
 * @param {Actor} character 
 * @param {boolean} state If they are doomed
 * @returns {Promise<any>} The update promise
 */
function setDoomState(character, state) {
    character.toggleStatusEffect("doomed", {active: state});
}

/** Sets the provided user to be doomed, and all other users to not be doomed
 * 
 * @param {Actor} actor 
 */
function setDoomedActor(actor) {
    // Find user with doomcoin already
    let undoom_targets = allDoomableActors().filter(a => a != actor);
    for(let undoom of undoom_targets) {
        setDoomState(undoom, false);
    }
    if(actor) {
        setDoomState(actor, true);
    }
}

// Get all actors in the game + current scene. I forget if non players can be doomed, bj,
function allDoomableActors() {
    // let unlinked = canvas.scene.tokens.filter(t => !t.actorLink);
    // return [...game.actors.contents, ...unlinked.map(t => t.actor)];
    return game.users.map(u => u.character).filter(x => x);
}

export function onReceiveSetDoom(payload) {
    if(game.user.isGM) {
        setDoomedActor(payload.actor ? fromUuidSync(payload.actor) : null ?? null);
    }
}

export function broadcastSetDoom(actor) {
    if(game.user.isGM) {
        // Skip the middleman
        setDoomedActor(actor);
    } else {
        sendSocket(DOOMSONG.socket.doom, {
            actor: actor?.uuid ?? null
        });
        warnOnNoGM("Warning: No GM is online to handle un-dooming other players.");
    }
}