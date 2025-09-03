
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
        if (data["system.footing_bar.value"]) data["system.footing"] = data["system.footing_bar.value"];
        if (data["system.toughness_bar.value"]) data["system.toughness"] = data["system.toughness_bar.value"];

        // Fix array updates then delegate to super
        // data = this.system.fullUpdateData(data);
        return super.update(data, options);
    }

    /* @override
     * This is the best place to overwrite "top level" properties like name 
     * and prototype token attributes. Otherwise, use models
     */
    async _preCreate(...[data, options, user]) {
        await super._preCreate(data, options, user);

        let mods = {}

        // Set actorlink defaults
        if(data.prototypeToken?.actorLink == undefined) {
            let link = data.type === "player";
            mods["prototypeToken.actorLink"] = link;
        }

        // Set disposition defaults
        if(data.prototypeToken?.disposition == undefined) {
            mods["prototypeToken.disposition"]= {
                "player": CONST.TOKEN_DISPOSITIONS.FRIENDLY,
                "npc": CONST.TOKEN_DISPOSITIONS.HOSTILE,
            }[data.type] || CONST.TOKEN_DISPOSITIONS.NEUTRAL;
        }

        // Save only if necessary
        if(Object.keys(mods).length > 0) {
            this.updateSource(mods);
        }
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

    // Generates html for a tooltip describing the moves available for a dice in a given act
    actTooltip(act) {
        let moves = this.system.moves[act - 1];
        let items = moves.map(move => `<li>${move}</li>`);
        return `<ul>${items.join("")}</ul>`;
    }
}