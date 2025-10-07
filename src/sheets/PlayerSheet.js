import PlayerSheetComponent from "../components/sheets/player/PlayerSheet.svelte";
import { SvelteApplicationMixin } from "../overrides/svelte_mixin.svelte";
import { DoomsongActorSheet } from "./ActorSheet";

export class DoomsongPlayerSheet extends SvelteApplicationMixin(DoomsongActorSheet) {
    static DEFAULT_OPTIONS = {
        classes: ["player"],
        submit: false,
        svelte: {
            component: PlayerSheetComponent,
            props: {
            }
        },
        position: {
            width: 400,
            height: 700
        },
        actions: {
            toggleEdit: DoomsongPlayerSheet.toggleEdit
        },
        window: {
            controls: [ ]
        }
    }
}