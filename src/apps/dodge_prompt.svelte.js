import DodgeApp from "../components/apps/DodgeApp.svelte";
import HitResultApp from "../components/apps/HitResultApp.svelte";
import { DOOMSONG } from "../consts";
import { SvelteApplicationMixin } from "../overrides/svelte_mixin.svelte";
import { onlineOwners } from "../utils/ownership";
import { rollCheck } from "../utils/roll";

export class DodgePrompt extends SvelteApplicationMixin(foundry.applications.api.ApplicationV2) {
    static DEFAULT_OPTIONS = {
        classes: ["doomsong"],
        svelte: {
            component: DodgeApp
        },
        position: {
            width: 300,
            height: "auto"
        }
    }

    async _prepareContext(options) {
        let context = {
            ...await super._prepareContext(options),
            app: this,
            ...options.attack
        };
        return context;
    }

    // Cleanup
    async close(options) {
        if(this.options.attack.attack_id) {
            delete IN_PROGRESS_DEFENSE_APPS[this.options.attack.attack_id];
        }
        return super.close(options);
    }

    /**
     * @param {IncomingAttack} attack 
     * @returns The prompt application, so it can be programatically closed if need be
     */
    static showFor(attack) {
        let prompt = new DodgePrompt({
            window: {
                title: `${attack.attacker.name} attacks ${attack.defender.name}`
            }, 
            attack
        })
        prompt.render({ force: true });
        return prompt;
    }
}

export class ResultPrompt extends SvelteApplicationMixin(foundry.applications.api.ApplicationV2) {
    static DEFAULT_OPTIONS = {
        classes: ["doomsong"],
        svelte: {
            component: HitResultApp
        },
        position: {
            width: 400,
            height: "auto"
        }
    }

    async _prepareContext(options) {
        let context = {
            ...await super._prepareContext(options),
            app: this,
            ...options.attack
        };
        return context;
    }

    // Cleanup
    async close(options) {
        if(this.options.attack.attack_id) {
            delete IN_PROGRESS_RESULT_APPS[this.options.attack.attack_id];
        }
        return super.close(options);
    }

    /**
     * @param {IncomingAttack} attack 
     * @returns The prompt application, so it can be programatically closed if need be
     */
    static showFor(attack) {
        let prompt = new DodgePrompt({
            window: {
                title: `${attack.attacker.name} attacks ${attack.defender.name}`
            }, 
            attack
        })
        prompt.render({ force: true });
        return prompt;
    }
}


// Maps attack id to a DodgePrompt, if there is one. Dodgeprompts
const IN_PROGRESS_DEFENSE_APPS = {};
// Maps attack id to a DodgePrompt, if there is one
const IN_PROGRESS_RESULT_APPS = {};


/** Summons a defense prompt
 * @param {IncomingAttack} data 
 */
function handleIncomingAttack(data) {
    // Hydrate
    let defender = fromUuidSync(defender); // A token

    // Spawn a defense window if we control the token
    if (defender.isOwner) {
        IN_PROGRESS_DEFENSE_APPS[data.attack_id] = DodgePrompt.showFor({
            attack_id,
            attacker,
            defender,
            ...rest
        });
    }
}

/** The attacker always handles the roll
 * 
 * @param {DefenseAttempt} data 
 */
export async function handleDefenseAttempt(data) {
    // Have original user handle, always
    if(game.user.id != data.attack.attack.user) return;
}


export async function handleCompleteAttack(data) {
    let { attack_id, total_defense: difficulty, bonus, mode, attacker, defender, footing_spent } = data;

    // Close the app
    if (IN_PROGRESS_DEFENSE_APPS[attack_id]) {
        IN_PROGRESS_DEFENSE_APPS[attack_id].close();
        delete IN_PROGRESS_DEFENSE_APPS[attack_id];
    }

    // Subtract footing
    defender = fromUuidSync(defender);
    defender.update({
        "system.footing": Math.max(0, defender.system.footing - footing_spent)
    });

    // Do the roll
    await rollCheck({ roll_type: "attack", difficulty, bonus, mode, speaker: fromUuidSync(attacker), footing_spent });
}

// Init our attack socket event
Hooks.on("ready", () => {
    // Socket event to prompt for defenders
    game.socket.on(`${game.system.id}.${DOOMSONG.socket.attack.incoming_attack}`, handleDefense);

    // Socket event to roll defense
    game.socket.on(`${game.system.id}.${DOOMSONG.socket.attack.attack_response}`, handleCompleteAttack);
});

/** 
 * @typedef {object} AttackMetadata
 * @property {string} user id of the user initiating this attack
 * @property {string} attacker UUID of the actor(!) initiating this attack
 * @property {("bludgeoning" | "piercing" | "slashing")} [type] If provided, the type of damage used for selecting damage tables. 
 * @property {string} [formula] Determines how dice are rolled (if at all) for this attack. If not provided, the attack hits automatically, 
 *                              and will not be prompted unless dodge_footing is specified.
 * @property {boolean} [double_footing] If true, then footing spent to dodge this attack is doubled
 * @property {number} [dodge_cost] If provided, then spending this much footing allows you to completely ignore the attack. Usually for "guaranteed" attacks. Still prompts a defense
 * @property {string} [effect] If provided, a flat amount of toughness loss or status to apply. Often paired with dodge_cost.
 */

/** Provided by the Roller app to initiate an attack. Will be processed into an "IncomingAttack" and emitted via socket
 * @typedef {object} InitiateAttackParams
 * @property {Token[]} targets An array of target tokens
 * @property {AttackMetadata} attack Attack metadata
 */

/** A specific attack in progress. Should be handled into a DefenseAttempt
 * @typedef {object} IncomingAttack
 * @property {string} attack_id Unique id of this attack flow
 * @property {string} target UUID of the target token
 * @property {AttackMetadata} attack Attack metadata
 */

/** A response to an incoming attack. Sent back to the attacker
 * @typedef {object} DefenseAttempt
 * @property {IncomingAttack} attack The incoming attack
 * @property {number} footing_spent Footing spent in defense. Effectively increases to-hit. Can also be used to satisfy "do"
 * @property {boolean} shield Do we have a shield? Augments footing spent if footing_spent > 0
 */

/** 
 * Symbol type for a token, can/should be replaced by proper fvtt types
 * @typedef {object} Token
 */


// Begin an attack flow. User should be a user id. Attacker should be an actor, targets should be an array of actors, bonus should be a flat number indicating the original to-hit
/**
 * 
 * @param {InitiateAttackParams} data 
 */
export function initiateAttack(data) {
    for (let target of data.targets) {
        let owners = onlineOwners(target);
        if (owners.length == 0) {
            ui.notifications.error("Nobody is online who has sufficient ownership to handle this attack");
            return;
        } else {
            if(data.attack.formula || data.attack.dodge_cost) {
                // If this is an interactive attack, submit to others and ourselves
                /** @type {IncomingAttack} */
                let payload = {
                    attack_id: foundry.utils.randomID(),
                    attack: data.attack,
                    target: target.uuid,
                };
                game.socket.emit(`${game.system.id}.${DOOMSONG.socket.attack.incoming_attack}`, payload);

                // Also handle locally. Auto filters based on ownership. This window will be auto cleaned up when the first person handles it
                handleIncomingAttack(payload);
            } else if(data.attack.effect) {
                // It still does something. Don't bother prompting an incoming attack, just spoof 0 footing spent and resolve as usual
                /** @type {DefenseAttempt} */
                let payload = {
                    attack: {
                        attack_id: foundry.utils.randomID(),
                        attack: data.attack,
                        target: target.uuid 
                    },
                    footing_spent: 0,
                    shield: false
                };
                game.socket.emit(`${game.system.id}.${DOOMSONG.socket.attack.attack_response}`, payload);
                handleCompleteAttack(payload);
            }
        }
    }
}