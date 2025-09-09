import DodgeApp from "../components/apps/DodgeApp.svelte";
import { DOOMSONG } from "../consts";
import { SvelteApplicationMixin } from "../overrides/svelte_mixin.svelte";

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
        let context = await super._prepareContext(options);
        context.app = this;
        context.attack_id = this.options.id;
        context.attacker = this.options.attacker;
        context.defender = this.options.defender;
        if (!context.attack_id || !context.attacker || !context.defender) {
            throw new TypeError("Options must include `attacker`, `defender`, `attack_id`");
        }
        return context;
    }

    static showFor({ attack_id, attacker, defender, options }) {
        let prompt = new DodgePrompt({
            window: {
                title: `${attacker.name} attacks ${defender.name}`
            }, attack_id, attacker, defender, attack_options: options
        })
        prompt.render({ force: true });
        return prompt;
    }
}

// Maps attack id to a DodgePrompt, if there is one

// Maps attack id to
const IN_PROGRESS_ATTACK_APPS = {};


// Init our attack socket event
Hooks.on("ready", () => {
    // Socket event to prompt for defenders
    game.socket.on(`${game.system.id}.${DOOMSONG.socket.attack.start_attack}`, (data) => {
        let { attack_id, attacker, defender, options } = data;

        // Hydrate
        attacker = fromUuidSync(attacker);
        defender = fromUuidSync(defender);

        // Spawn a defense window if we control the token (TODO)
        if (defender.isOwner) {
            IN_PROGRESS_ATTACK_APPS[attack_id] = DodgePrompt.showFor({
                attack_id,
                attacker,
                defender,
                options
            });
        }
    });

    // Socket event to roll defense - todo: handle multiple browsers.
    game.socket.on(`${game.system.id}.${DOOMSONG.socket.attack.finish_defense}`, (data) => {
        let { id } = data;
        // Close the apps associated with this defense event, just in case

    });
});

// Begin an attack flow. User should be a user id. Attacker should be a token, targets should be an array of tokens, bonus should be a flat number indicating the original to-hit
export function initiateAttack({ user, attacker, targets, bonus, options = {} }) {
    for (let target of targets) {
        game.socket.send(`${game.system.id}.${INITIATE_ATTACK_EVENT}`, {
            attack_id: foundry.utils.randomID(),
            user,
            attacker: attacker.uuid,
            defender: target.uuid,
            bonus,
            options
        });
    }
}