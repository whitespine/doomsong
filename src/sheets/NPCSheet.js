import NPCSheetComponent from "../components/sheets/NPCSheet.svelte";
import { SvelteApplicationMixin } from "../overrides/svelte_mixin.svelte";
import { DoomsongActorSheet } from "./ActorSheet";

export class DoomsongNPCSheet extends SvelteApplicationMixin(DoomsongActorSheet) {
    static get DEFAULT_OPTIONS() {
        return foundry.utils.mergeObject(super.DEFAULT_OPTIONS, {
            classes: ["doomsong", "actor", "npc"],
            svelte: {
                component: NPCSheetComponent
            },
            window: {
                resizable: true,
            },
            position: {
                width: 900
            }
        });
    }

    static get foo() {
        return "haha";
    }

    _getHeaderButtons() {
        let buttons = super._getHeaderButtons();

        buttons.unshift({
            class: "toggle-edit",
            icon: "fas fa-user",
            label: `Toggle Edit`,
            onclick: event => {
                console.log("Henlo");
                let block = this._svelte_props.block ?? false;
                block = !block;
                this._svelte_props.block = block;
                console.log(this._svelte_wrapper);
                console.log(this);
                if(block) {
                    this.element.addClass("doomsong-block");
                } else {
                    this.element.removeClass("doomsong-block");
                }
            }
        });

        return buttons;
    }
}