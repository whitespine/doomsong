import NPCSheetComponent from "../components/sheets/NPCSheet.svelte";
import { DoomsongActorSheet } from "./ActorSheet";

export class DoomsongNPCSheet extends DoomsongActorSheet {
    get componentToMount() {
        return NPCSheetComponent;
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