import NPCSheetComponent from "../components/sheets/NPCSheet.svelte";
import { SvelteApplicationMixin } from "../overrides/svelte_mixin.svelte";
import { DoomsongActorSheet } from "./ActorSheet";

export class DoomsongNPCSheet extends SvelteApplicationMixin(DoomsongActorSheet) {
    static get DEFAULT_OPTIONS() {
        return foundry.utils.mergeObject(super.DEFAULT_OPTIONS, {
            classes: ["doomsong", "actor", "npc"],
            svelte: {
                component: NPCSheetComponent,
                props: {
                    block: true
                }
            },
            window: {
                resizable: true,
            },
            position: {
                width: 400,
                height: 600
            }
        });
    }

    _getHeaderButtons() {
        let buttons = super._getHeaderButtons();

        buttons.unshift({
            class: "toggle-edit",
            icon: "fas fa-user",
            label: `Toggle Edit`,
            onclick: event => {
                let block = this._svelte_props.block ?? false;
                block = !block;
                this._svelte_props.block = block;
            }
        });

        return buttons;
    }
}