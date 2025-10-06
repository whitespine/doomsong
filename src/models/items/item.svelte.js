import { DoomsongDataModel } from "../base.svelte";

const fields = foundry.data.fields;

export class ItemModel extends DoomsongDataModel {
    // Some schema elements are consistent across all actor types. Define them here
    static defineSchema() {
        return {
            // Nothing is really universal...
        };
    }
}
