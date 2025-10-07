import { SvelteApplicationMixin } from "../overrides/svelte_mixin.svelte";
import NPCSheetComponent from "../components/sheets/npc/NPCSheet.svelte";
import PlayerSheetComponent from "../components/sheets/player/PlayerSheet.svelte";

export class DoomsongActorSheet extends foundry.applications.sheets.ActorSheetV2 {
    static DEFAULT_OPTIONS = {
        classes: ["doomsong", "actor"],
        closeOnSubmit: false,
        submit: false,
        submitOnClose: false,
        submitOnChange: false,
        baseApplication: "ActorSheet",
        window: {
            resizable: true,
        }
    }

    async _prepareContext(options) {
        let context = await super._prepareContext(options);
        context.actor = this.actor;
        return context;
    }

    // Helper for setting an image that also hits token
    async setImage(img) {
        const mm = "icons/svg/mystery-man.svg";
        let current_token;
        let update = {
            img: img
        };
        if (this.actor.token) {
            current_token = this.actor.token.texture.src;
        } else {
            current_token = this.actor.prototypeToken.texture.src;
        }
        let sync = this.actor.img == current_token || current_token == mm;
        if (!sync) {
            return this.actor.update(update);
        } else if (this.actor.token) {
            return this.actor.update(update).then(() => this.actor.token.update({
                "texture.src": img
            }));
        } else {
            // Sync em up
            update["prototypeToken.texture.src"] = img;
            return this.actor.update(update);
        }
    }
}

export class DoomsongNPCSheet extends SvelteApplicationMixin(DoomsongActorSheet) {
    static DEFAULT_OPTIONS = {
        classes: ["npc"],
        svelte: {
            component: NPCSheetComponent,
            props: {
                block: true
            }
        },
        position: {
            width: 400,
            height: "auto"
        },
        actions: {
            toggleEdit: DoomsongNPCSheet.toggleEdit
        },
        window: {
            controls: [
                {
                    // font awesome icon
                    icon: 'fa-solid fa-edit',
                    // string that will be run through localization
                    label: "Toggle Edit",
                    // string that MUST match one of your `actions`
                    // action: "toggleEdit",
                    action: "toggleEdit",
                }
            ]
        }
    }

    static toggleEdit(_evt, _target) {
        // Due to weird bindings, we can use `this`
        let block = this.props.block ?? true;
        block = !block;
        this.props.block = block;
        this.setPosition({
            width: block ? 400 : 800,
            height: block ? "auto" : 800,
        });
    }
}

export class DoomsongPlayerSheet extends SvelteApplicationMixin(DoomsongActorSheet) {
    static DEFAULT_OPTIONS = {
        classes: ["player"],
        svelte: {
            component: PlayerSheetComponent
        },
        position: {
            width: 400,
            height: 700
        },
        actions: {
            toggleEdit: DoomsongPlayerSheet.toggleEdit
        }
    }
}