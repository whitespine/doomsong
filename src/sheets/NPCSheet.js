import NPCSheetComponent from "../components/sheets/NPCSheet.svelte";
import { DoomsongActorSheet } from "./ActorSheet";

export class DoomsongNPCSheet extends DoomsongActorSheet {
    get componentToMount() {
        return NPCSheetComponent;
    }
}