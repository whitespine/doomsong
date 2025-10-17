/** @import {Consequence} from "../utils/roll.svelte" */

import { GenericComponentApp } from "../apps/generic_app";
import { RollerApp } from "../apps/roll_app.svelte";
import EditTraitApp from "../components/apps/EditTraitApp.svelte";

/**
 * Our custom class for Icon Actors
 */
export class DoomsongActor extends Actor {
    /* @override
     * This is the best place to overwrite "top level" properties like name 
     * and prototype token attributes. Otherwise, use models
     */
    async _preCreate(...[data, options, user]) {
        await super._preCreate(data, options, user);

        let mods = {}

        // Set token defaults
        if(data.prototypeToken?.displayBars) {
            mods["prototypeToken.displayBars"] = 50;
        }
        if(data.prototypeToken?.displayName) {
            mods["prototypeToken.displayName"] = 50;
        }
        if(data.prototypeToken?.bar1?.attribute) {
            mods["prototypeToken.bar1.attribute"] = "toughness";
        }
        if(data.prototypeToken?.bar2?.attribute) {
            mods["prototypeToken.bar2.attribute"] = "toughness";
        }

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

    // All we do here is show changes in stats
    prepareDerivedData() {
        super.prepareBaseData();
        this._showDeltaStats();
    }


    _oldToughness = this.system.toughness.value;
    _oldFooting = this.system.footing.value;
    /**
     * Show a scrolling stat change for footing/toughness, if they change
     */
    _showDeltaStats() {
        let tough_delta = this.system.toughness.value - this._oldToughness;
        if (tough_delta) {
            this._oldToughness = this.system.toughness.value;
            this._displayScrollingDelta("Toughness", tough_delta);
        }
        let footing_delta = this.system.footing.value - this._oldFooting;
        if (footing_delta) {
            this._oldFooting = this.system.footing.value;
            this._displayScrollingDelta("Footing", footing_delta);
        }
    }

    /**
       * Display changes to active effects as scrolling Token status text.
       * @param {boolean} enabled     Is the active effect currently enabled?
       * @protected
       */
    _displayScrollingDelta(attribute, delta) {
        const tokens = this.getActiveTokens(true);
        const text = `${delta > 0 ? "+" : ""}${delta} ${attribute}`;
        for (const token of tokens) {
            if (!token.visible || token.document.isSecret) continue;
            canvas.interface.createScrollingText(token.center, text, {
                anchor: CONST.TEXT_ANCHOR_POINTS.CENTER,
                direction: delta > 0 ? CONST.TEXT_ANCHOR_POINTS.TOP : CONST.TEXT_ANCHOR_POINTS.BOTTOM,
                distance: (2 * token.h),
                fontSize: 28,
                stroke: 0x000000,
                strokeThickness: 4,
                jitter: 0.25 // TODO experiment with this
            });
        }
    }

    /**
     * 
     * @param {Consequence} consequence 
     */
    async applyConsequence(consequence) {
        if (consequence.toughness) {
            let delta = (typeof consequence.toughness == "string") ? (await new Roll(consequence.toughness).roll()).total : consequence.toughness;
            let new_toughness = this.system.toughness.value + delta;
            if (consequence.min_toughness != null && this.system.toughness.value >= consequence.min_toughness && new_toughness < consequence.min_toughness) new_toughness = consequence.min_toughness;
            if (consequence.max_toughness != null && this.system.toughness.value <= consequence.max_toughness && new_toughness > consequence.max_toughness) new_toughness = consequence.max_toughness;
            await this.update({
                "system.toughness.value": new_toughness
            });
        } else if (consequence.footing) {
            let delta = (typeof consequence.footing == "string") ? (await new Roll(consequence.footing).roll()).total : consequence.footing;
            let new_footing = this.system.footing.value + delta;
            if (consequence.min_footing != null && this.system.footing.value >= consequence.min_footing && new_footing < consequence.min_footing) new_footing = consequence.min_footing;
            if (consequence.max_footing != null && this.system.footing.value <= consequence.max_footing && new_footing > consequence.max_footing) new_footing = consequence.max_footing;
            await this.update({
                "system.footing.value": new_footing
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


    // Add a new tag
    async promptAddTrait() {
        let id = foundry.utils.randomID();
        let path = `system.traits.${id}`; 
        await this.update({
            [path]: null
        });
        let app = new GenericComponentApp(EditTraitApp, { doc: this, path });
        app.render({ force: true });
    }


    // Can be removed in v14, replaced with a flag
    get temporaryEffects() {
        const effects = [];
        for (const effect of this.allApplicableEffects()) {
            if (effect.active && effect.isTemporary) effects.push(effect);
            else if(effect.flags[game.system.id]?.show) effects.push(effect);
        }
        return effects;
    }
}