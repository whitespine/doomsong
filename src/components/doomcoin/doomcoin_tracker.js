import skull from "$assets/icons/skull.png";

export function initDoomRenderHook() {
    Hooks.on("renderPlayers", (_players, element, context, _options) => {
        // GM's are never doomed
        for(let user of game.users.contents) {
            if(user.isGM) continue;
            if(!user.active) continue;
            let doomed = get_doomcoin_state(user);
            if(doomed) { 
                let doomed_user_li = element.querySelector(`[data-user-id=${user._id}]`);
                let doomcoin_elt = document.createElement("img");
                doomcoin_elt.src = skull;
                doomcoin_elt.style = "max-width: 32px; max-height: 32px; background-color: white; border-radius: 16px";
                doomed_user_li.appendChild(doomcoin_elt);
            }
        }
    });
}

/** Check if a user is doomed
 * 
 * @param {User} user 
 * @returns {boolean} If they are doomed
 */
function get_doomcoin_state(user) {
    return user.flags[game.system.id]?.doomcoin ?? false;
}

/** Set if a user is doomed
 * 
 * @param {User} user 
 * @param {boolean} state If they are doomed
 * @returns {Promise<any>} The update promise
 */
function set_doomcoin_state(user, state) {
    return user.update({
        [`flags.${game.system.id}.doomcoin`]: state
    });
}

/** Sets the provided user to be doomed, and all other users to not be doomed
 * 
 * @param {User} user 
 */
export function setDoomedUser(user) {
    // Find user with doomcoin already
    let doomed_users = game.users.contents.filter(u => get_doomcoin_state(u));
    let undoom_targets = doomed_users.filter(u => u != user);
    for(let undoom of undoom_targets) {
        set_doomcoin_state(undoom, false);
    }
    if(user) {
        set_doomcoin_state(user, true);
    }
}