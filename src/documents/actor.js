import PlayerDefaultMoves from "./player_moves.json"

/**
 * Our custom class for Icon Actors
 */
export class DoomsongActor extends Actor {
    /**
     * Patch update to preserve arrays
     *
     * @param data
     *
     * @param options
     */
    async update(data, options = {}) {
        // Handle token updates
        if(data["system.footing_bar.value"]) data["system.footing"] = data["system.footing_bar.value"];
        if(data["system.toughness_bar.value"]) data["system.toughness"] = data["system.toughness_bar.value"];

        // Fix array updates then delegate to super
        data = this.system.fullUpdateData(data);
        return super.update(data, options);
    }

    /* @override
     * This is overridden to pre-populate with slightly more sensible data,
     * such as nicer icons and default names, token dispositions, etc
     */
    async _preCreate(...[data, options, user]) {
        await super._preCreate(data, options, user);

        let mods = {};

        // Set default link status
        let actorLink = data.prototypeToken?.actorLink ?? (data.type === "player");
        mods.prototypeToken = {
            actorLink
        };

        // Add default moves
        if(data.type === "player") {
            console.log(PlayerDefaultMoves);
            mods["system.moves"] = PlayerDefaultMoves;
        }

        // Put in the basics
        this.updateSource(mods);
    }

    prepareDerivedData() {
        // Combat stats shared by all actors
        this.system.toughness_bar = {
            min: 0,
            max: this.system.max_toughness,
            value: this.system.toughness
        }
        this.system.footing_bar = {
            min: 0,
            max: this.system.max_footing,
            value: this.system.footing
        }
        this.system.attack_difficulty = Math.max(this.system.toughness + this.system.protection, this.system.min_difficulty || 0);
    }

}