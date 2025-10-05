/** @import {Consequence} from "../utils/roll.svelte" */

import { rollCheck } from "../utils/roll.svelte";
import { RollerApp } from "../apps/roll_app.svelte";

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

    // Apply the dead status effect
    async markDead() {
        if (!this.statuses.has("dead")) {
            await this.createEmbeddedDocuments("ActiveEffect", [{
                name: "Dead",
                img: "icons/svg/skull.svg",
                statuses: ["dead"],
                flags: {
                    core: {
                        overlay: true // Makes it big
                    }
                }
            }]);
        }
    }

    /**
     * 
     * @param {Consequence} consequence 
     */
    async applyConsequence(consequence) {
        if (consequence.toughness) {
            let delta = (typeof consequence.toughness == "string") ? (await new Roll(consequence.toughness).roll()).total : consequence.toughness;
            let new_toughness = this.system.toughness + delta;
            if (consequence.min_toughness != null && this.system.toughness >= consequence.min_toughness && new_toughness < consequence.min_toughness) new_toughness = consequence.min_toughness;
            if (consequence.max_toughness != null && this.system.toughness <= consequence.max_toughness && new_toughness > consequence.max_toughness) new_toughness = consequence.max_toughness;
            await this.update({
                "system.toughness": new_toughness
            });
        } else if (consequence.footing) {
            let delta = (typeof consequence.footing == "string") ? (await new Roll(consequence.footing).roll()).total : consequence.footing;
            let new_footing = this.system.footing + delta;
            if (consequence.min_footing != null && this.system.footing >= consequence.min_footing && new_footing < consequence.min_footing) new_footing = consequence.min_footing;
            if (consequence.max_footing != null && this.system.footing <= consequence.max_footing && new_footing > consequence.max_footing) new_footing = consequence.max_footing;
            await this.update({
                "system.footing": new_footing
            });
        } else if (consequence.resist_death) {
            if (this.type == "npc" && this.system.action_dice == 1) {
                // Die instantly
                await this.markDead();
            } else {
                RollerApp.prompt(this, {
                    roll: {
                        difficulty: 3, // TODO track # of death resists
                        roll_type: "death"
                    }
                });
            }
        } else if (consequence.injury) {
            await this.createEmbeddedDocuments("ActiveEffect", [{
                name: consequence.injury.name,
                img: consequence.injury.icon ?? "icons/svg/bones.svg",
                statuses: ["cursed"],
                flags: {
                    [game.system.id]: {
                        type: "injury"
                    }
                }
            }]);
        } else if (consequence.condition) {
            await this.createEmbeddedDocuments("ActiveEffect", [{
                name: consequence.condition.name,
                img: consequence.condition.icon ?? "icons/svg/daze.svg",
                statuses: ["paralyzed"],
                flags: {
                    [game.system.id]: {
                        type: "condition"
                    }
                }
            }]);
        } else {
            ui.notifications.warn("This isn't automated yet");
        }
    }
}