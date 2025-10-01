import AttackFlowComponent from "../components/apps/attack/FlowComponent.svelte";
import { DOOMSONG } from "../consts";
import { SvelteApplicationMixin } from "../overrides/svelte_mixin.svelte";
import { onlineOwners } from "../utils/ownership";

export class AttackFlowApp extends SvelteApplicationMixin(foundry.applications.api.ApplicationV2) {
    /** @type {AttackFlow} */
    flow = $state(null);

    constructor(flow, options = {}) {
        super(options);
        this.flow = flow;
    }

    static DEFAULT_OPTIONS = {
        classes: ["doomsong"],
        svelte: {
            component: AttackFlowComponent
        },
        position: {
            width: 300,
            height: "auto"
        }
    }

    async _prepareContext(options) {
        let context = {
            ...await super._prepareContext(options),
            app: this // Via which we can access the flow in a stateful manner
        };
        return context;
    }

    // Cleanup
    async close(options) {
        if (this.options.attack.attack_id) {
            delete IN_PROGRESS_APPS[this.options.attack.attack_id];
        }
        return super.close(options);
    }

    /**
     * @param {AttackFlow} flow 
     */
    static async showFlow(flow) {
        let close = flow.step == FLOW_STEPS.COMPLETE;
        let in_progress = IN_PROGRESS_APPS[flow.attack_id];

        if (in_progress) {
            if (close) {
                in_progress.close();
            } else {
                in_progress.flow = flow;
            }
        } else {
            if (close) {
                // Do nothing
            } else {
                // Start and render a new one
                let attacker = fromUuidSync(flow.attack.attacker);
                let defender = fromUuidSync(flow.attack.defender);
                let prompt = new AttackFlowApp({
                    window: {
                        title: `${attacker.name} attacks ${defender.name}`
                    },
                });
                IN_PROGRESS_APPS[flow.attack_id] = prompt;
                await prompt.render({ force: true });
            }
        }
    }
}


// Maps attack id to a DodgePrompt, if there is one. Dodgeprompts
const IN_PROGRESS_APPS = {};

/**
 * What step in the flow are we?
 * @typedef {string} FlowStep
 */

/** 
 * @enum {FlowStep}
 */
export const FLOW_STEPS = {
    INITIATE: "UNUSED_FOR_NOW",
    DEFENSE: "DEFEND_YOURSELF",
    ROLL: "ROLL_THOSE_BONES",
    RESOLVE: "FLIP_THE_COIN_COWARD",
    COMPLETE: "IT_ALL_ENDS_SOMEDAY"
};


// Init our attack socket event
Hooks.on("ready", () => {
    // Socket event to roll defense
    game.socket.on(`${game.system.id}.${DOOMSONG.socket.update_attack}`, (flow) => AttackFlowPrompt.showFlow(flow));
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

/** Provided by the Roller app to initiate an attack. Will be processed into an "AttackFlow" and emitted via socket
 * @typedef {object} InitiateAttackParams
 * @property {Token[]} targets An array of target tokens
 * @property {AttackMetadata} attack Attack metadata
 */

/** A specific attack in progress. 
 * @typedef {object} AttackFlow
 * @property {string} attack_id Unique id of this attack flow
 * @property {string} target UUID of the target actor
 * @property {AttackMetadata} attack Attack metadata
 * @property {FlowStep} step What stage in the flow we are
 * @property {number} footing_spent Footing spent in defense. Effectively increases to-hit. Can also be used to satisfy "do"
 * @property {number} bonus_dodge Augments footing spent, but does not cost footing
 * @property {number} final_target Populated after defense submitted. The difficulty of the check
 * @property {number} roll_result The number we rolled
 */

/** 
 * Symbol type for a token, can/should be replaced by proper fvtt types
 * @typedef {object} Token
 */


/**
 * Both broadcasts a flow and also updates it locally
 * @param {AttackFlow} flow 
 */
export function broadcastFlow(flow) {
    return Promise.all([
        game.socket.emit(`${game.system.id}.${DOOMSONG.socket.update_attack}`, flow),
        AttackFlowApp.showFlow(flow)
    ]);
}


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
            /** @type {AttackFlow} */
            let flow = {
                attack_id: foundry.utils.randomID(),
                attack: data.attack,
                target: target.uuid,
                footing_spent: 0,
                shield: false,
                step: FLOW_STEPS.DEFENSE
            };
            if (data.attack.formula || data.attack.dodge_cost) {
                // The defender needs a chance to respond
                flow.step = FLOW_STEPS.DEFENSE;
            } else if (data.attack.effect) {
                // It still does something, but does not need a roll. Skip to the resolution step
                flow.step = FLOW_STEPS.RESOLVE;
            }
            broadcastFlow(flow);
        }
    }
}