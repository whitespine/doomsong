
import Roller from "../components/rolls/Roller.svelte";
import { DOOMSONG } from "../consts";
import { SvelteApplicationMixin } from "../overrides/svelte_mixin.svelte";
import { onlineOwners } from "../utils/ownership";

/** @import {AttackFlow} from "./dodge_prompt.svelte"  */

export class RollerApp extends SvelteApplicationMixin(foundry.applications.api.ApplicationV2) {
    /** @type {Actor} */
    actor;

    /** Called when an attack flow is started or a chat message is created by the app.
     * If the app is closed before doing either of those things, returns null.
     * @type {(ChatMessage | AttackFlow | null) => any} 
     */
    callback;

    /** Should we still callback when we close? */
    _callback_on_close = true;

    constructor(actor, options = {}) {
        if (!(actor instanceof Actor)) {
            throw new TypeError("Provided actor must be an actor");
        }
        super(foundry.utils.mergeObject({
            window: {
                title: `Check: ${actor.name}`
            }
        }, options));
        this.actor = actor;
        this.callback = options.callback;
    }

    static DEFAULT_OPTIONS = {
        classes: ["doomsong"],
        svelte: {
            component: Roller
        },
        position: {
            // width: 400,
            // height: "auto"
        }
    }


    // Cleanup
    async close(options) {
        if (this.callback && this._callback_on_close) {
            this.callback(null);
        }
        return super.close(options);
    }

    /**
     * @param {Actor} actor The actor this roll should be done as
     * @param {object} options Options to include
     * @returns {Promise<ChatMessage | AttackFlow | null>} The ChatMessage/AttackFlow if one is created, null otherwise
     */
    static prompt(actor, options = {}) {
        return new Promise((succ) => {
            let app = new RollerApp(actor, {
                ...options,
                callback: succ
            });
            app.render({ force: true });
        });
    }
}