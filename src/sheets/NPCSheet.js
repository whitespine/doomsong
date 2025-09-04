import NPCSheetComponent from "../components/sheets/NPCSheet.svelte";
import { SvelteApplicationMixin } from "../overrides/svelte_mixin.svelte";
import { DoomsongActorSheet } from "./ActorSheet";

export class DoomsongNPCSheet extends SvelteApplicationMixin(DoomsongActorSheet) {
    static DEFAULT_OPTIONS = {
        classes: ["npc"],
        submit: false,
        svelte: {
            component: NPCSheetComponent,
            props: {
                block: false // TODO revert to true
            }
        },
        position: {
            width: 400,
            height: 600
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