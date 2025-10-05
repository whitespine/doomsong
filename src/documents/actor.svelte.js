/** @import {Consequence} from "../utils/roll.svelte" */

import { rollCheck } from "../utils/roll.svelte";

/**
 * Our custom class for Icon Actors
 */
export class DoomsongActor extends Actor {
    /**
     * Patch update to handle pseudo-bars
     *
     * @param data
     *
     * @param options
     */
    async update(data, options = {}) {
        // Handle token updates
        if (data["system.footing_bar.value"]) data["system.footing"] = data["system.footing_bar.value"];
        if (data.system?.footing_bar?.value) data["system.footing"] = data?.system?.footing_bar?.value;
        if (data["system.toughness_bar.value"]) data["system.toughness"] = data["system.toughness_bar.value"];
        if (data.system?.toughness_bar?.value) data["system.toughness"] = data.system?.toughness_bar?.value;

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
        if (data.prototypeToken?.actorLink == undefined) {
            let link = data.type === "player";
            mods["prototypeToken.actorLink"] = link;
        }

        // Set disposition defaults
        if (data.prototypeToken?.disposition == undefined) {
            mods["prototypeToken.disposition"] = {
                "player": CONST.TOKEN_DISPOSITIONS.FRIENDLY,
                "npc": CONST.TOKEN_DISPOSITIONS.HOSTILE,
            }[data.type] || CONST.TOKEN_DISPOSITIONS.NEUTRAL;
        }

        // Save only if necessary
        if (Object.keys(mods).length > 0) {
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

    /**
     * 
     * @param {Consequence} consequence 
     */
    async applyConsequence(consequence) {
        if(consequence.toughness) {
            let new_toughness = this.system.toughness + consequence.toughness;
            if(consequence.min_toughness && this.system.toughness >= consequence.min_toughness && new_toughness < consequence.min_toughness) new_toughness = consequence.min_toughness;
            if(consequence.max_toughness && this.system.toughness <= consequence.max_toughness && new_toughness > consequence.max_toughness) new_toughness = consequence.max_toughness;
            await this.update({
                "system.toughness": new_toughness
            });
        }
        if(consequence.footing) {
            let new_footing = this.system.footing + consequence.footing;
            if(consequence.min_footing && this.system.footing >= consequence.min_footing && new_footing < consequence.min_footing) new_footing = consequence.min_footing;
            if(consequence.max_footing && this.system.footing <= consequence.max_footing && new_footing > consequence.max_footing) new_footing = consequence.max_footing;
            await this.update({
                "system.footing": new_footing
            });
        }
        if(consequence.resist_death) {
            // TODO: handle death resist
            rollCheck({

            })
        }
        if(consequence.injury) {
            // TODO: Add some sort of injury status effect
        }
        if(consequence.condition) {
            // TODO: Add a condition
        }

        // TODO: Batch updates
    }
}