import DodgeApp from "../components/apps/DodgeApp.svelte";
import { SvelteApplicationMixin } from "../overrides/svelte_mixin.svelte";

export class DodgePrompt extends SvelteApplicationMixin(foundry.applications.api.ApplicationV2) {
    static DEFAULT_OPTIONS = {
        classes: ["doomsong"],
        svelte: {
            component: DodgeApp
        },
        position: {
            width: 700,
            height: "auto"
        }
    }

    async _prepareContext(options) {
        let context = await super._prepareContext(options);
        context.app = this;
        context.attacker = this.options.attacker;
        context.defender = this.options.defender;
        if(!context.attacker || !context.defender) {
            throw new TypeError("Options must include `attacker`, `defender`");
        }
        return context;
    }
}

// Maps attack id to a DodgePrompt, if there is one

// Maps attack id to
const ATTACKS_IN_PROGRESS = $state({});

const ATTACK_SOCKET_EVENT = "update_attack";

// Init our attack socket event
Hooks.on("ready", () => {
    game.socket.on(`${game.system.id}.${ATTACK_SOCKET_EVENT}`, (data) => {
        // Hydrate
        ATTACKS_IN_PROGRESS[data.id] = data;
    });
});

// Begin an attack flow. Targets should be an array of tokens, bonus should be a flat number indicating the original to-hit
export function initiateAttack(targets, bonus, options={}) {
    game.socket.send(`${game.system.id}.${ATTACK_SOCKET_EVENT}`, {
        id: foundry.utils.randomID(),
        targets:
    });
}