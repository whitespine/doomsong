/**
 * Our custom class for Doomsong Items
 */
export class DoomsongItem extends Item {
    /* @override
     * This is the best place to overwrite "top level" properties like name 
     * and prototype token attributes. Otherwise, use models
     */
    async _preCreate(...[data, options, user]) {
        await super._preCreate(data, options, user);

        let mods = {}

        // Save only if necessary
        if (Object.keys(mods).length > 0) {
            this.updateSource(mods);
        }
    }
}