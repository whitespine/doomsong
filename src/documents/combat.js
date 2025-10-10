import { DOOMSONG } from "../consts";


export class DoomsongCombat extends Combat {
    // Return the first act with any combatants, or null if all unset
    get #actsWithCombatants() {
        let cba = this.combatantsByAct;
        return [1,2,3,4,5,6].filter(act => cba[act].length != 0);
    }

    // Advance this combat to the previous phase, or act within a phase
    async nextPhase(skipEmptyActs = true) {
        if (this.system.phase == "acts") {
            // Advance within acts, if there are remaining 
            let new_act;
            if(skipEmptyActs) {
                new_act = this.#actsWithCombatants.filter(act => act > this.system.act)[0] ?? 7;
            } else {
                new_act = this.system.act + 1;
            }
            
            // If new_act is now 7+, change phase to retreat instead. Leave act unchanged
            if (new_act > 6) {
                return this.update({
                    "system.phase": "retreat"
                });
            } else {
                // Otherwise, use it
                return this.update({
                    "system.act": new_act
                });
            }
        } else {
            // Other phases are simpler to handle
            let next = {
                "begin": "set",
                "set": "acts",
                "retreat": "end",
                "end": "begin",
            }[this.system.phase] || "begin";
            let update = {
                "system.phase": next
            };

            // Reset act to 1 if we're entering acts (or the first empty)
            if (next == "acts") {
                // Before skipping any acts, we first randomize unset npc actions
                await this.randomizeNPCActions();

                if (skipEmptyActs) {
                    update["system.act"] = this.#actsWithCombatants[0] ?? 1;
                } else {
                    update["system.act"] = 1; // Just do the first
                }
            }

            // Reset all combatant dice if entering "begin"
            if (next == "begin") {
                await this.clearSetDice();
            }

            // Finally perform our update
            return this.update(update);
        }
    }

    // Unadvance this combat to the previous phase
    prevPhase(skipEmptyActs = true) {
        if (this.system.phase == "acts") {
            // Regress within acts, if there are remaining 
            let new_act;
            if(skipEmptyActs) {
                new_act = this.#actsWithCombatants.filter(act => act < this.system.act)[0] ?? 0;
            } else {
                new_act = this.system.act - 1;
            }

            // If new_act is now <= 0, change phase to set instead.
            if (new_act <= 0) {
                return this.update({
                    "system.phase": "set"
                });
            } else {
                // Otherwise, use the new act
                return this.update({
                    "system.act": new_act
                });
            }
        } else {
            // Other phases are simpler to handle
            let prev = {
                "set": "begin",
                "acts": "set",
                "retreat": "acts",
                "end": "retreat",
                "begin": "end",
            }[this.system.phase] || "begin";

            // Reset act to 6 if we're entering acts (or the first empty)
            if (next == "acts") {
                // Before skipping any acts, we first randomize unset npc actions
                if (skipEmptyActs) {
                    update["system.act"] = this.#actsWithCombatants.reverse()[0] ?? 1;
                } else {
                    update["system.act"] = 6; // Just do the first
                }
            }

            // Finally perform our update
            return this.update({
                "system.phase": prev
            });
        }
    }

    // Clear all combatant actions
    async clearSetDice() {
        let updates = this.combatants.contents.map(c => ({
            _id: c._id,
            "system.set_dice": []
        }));
        await DoomsongCombatant.updateDocuments(updates, { parent: this });
    }

    // Randomize all non-player unset actions
    async randomizeNPCActions() {
        let updates = [];
        this.combatants.contents.forEach(c => {
            if (c.actor.type == "npc" && c.system.set_dice.length < c.system.available_dice) {
                let new_set = [...c.system.set_dice, ...c.randomDice(c.system.available_dice - c.system.set_dice.length)];
                updates.push({
                    "_id": c._id,
                    "system.set_dice": new_set
                });
            }
        })
        await DoomsongCombatant.updateDocuments(updates, { parent: this });
    }

    // Modify this function to more or less simulate the normal triggerTurnEvents
    _manageTurnEvents() {

    }

    _onUpdate(changed, options, userId) {
        super._onUpdate(changed, options, userId);
        // always update turn markers
        this._updateTurnMarkers();

        // Clear movement histories 
        // this._clearMovementHistoryOnStartTurn(combatant, context)
        if(changed.system?.act) {
            let act = this.system.act;
            this.combatantsByAct[act].forEach(c => c.token.clearMovementHistory());
        }
         // combatant.token.clearMovementHistory();

        let stateChanged = true;
        if (this.active) {
            // const play = c => c && (game.user.isGM ? !c.hasPlayerOwner : c.isOwner);
            // if ( play(this.combatant) ) this._playCombatSound("yourTurn");
            // else if ( play(this.nextCombatant) ) this._playCombatSound("nextUp");
        }
    }

    // Override this function to support multiple turn markers
    _updateTurnMarkers() {
        if (!canvas.ready) return;
        const any_active = this.system.phase == "acts" && this.active;
        // Get the on deck tokens if this combat is active
        let current_tokens = any_active ? this.combatantsByAct[this.system.act].map(cba => cba.combatant.token.object).filter(x => x) : [];

        // Remove foe tokens if settings don't let you see same act 
        let view_acts = game.settings.get(game.system.id, DOOMSONG.settings.combat.view_acts.key);
        if (view_acts == "never") {
            current_tokens = current_tokens.filter(t => t.document?.disposition == CONST.TOKEN_DISPOSITIONS.FRIENDLY); // Only show friendly
        }

        // Clean up inactive
        for (const token of canvas.tokens.turnMarkers) {
            if (!current_tokens.includes(token)) token.renderFlags.set({ refreshTurnMarker: true });
        }

        // Set up active
        for (const token of current_tokens) {
            token?.renderFlags.set({ refreshTurnMarker: true });
        }
    }

    // Returns an Object<ActNumber, Array<[combatant, dice_this_act]>>
    get combatantsByAct() {
        let result = {};
        for (let act = 1; act <= 6; act++) {
            let all_this_act = [];
            for (let c of this.combatants) {
                let dice_this_act = c.system.set_dice.filter(x => x == act).length;
                if (dice_this_act > 0) {
                    all_this_act.push({
                        combatant: c,
                        actions: dice_this_act
                    });
                }
            }

            // Save no matter what, even if empty
            result[act] = all_this_act;
        }
        return result;
    }
}

export class DoomsongCombatant extends Combatant {
    ////////////////////////////////////////////////////////////
    // Combat utilities
    ////////////////////////////////////////////////////////////
    // Set a dice with a particular value
    setDice(...values) {
        let current = [...this.system.set_dice];
        // Add as many as we can
        for (let value of values) {
            if (current.length < this.system.available_dice) {
                current.push(value);
            }
        }
        return this.update({
            "system.set_dice": current.sort()
        });
    }

    // Can we currently set dice?
    canSetDie() {
        return this.system.set_dice.length < this.system.available_dice;
    }

    // Generate a random dice value
    randomDice(count = 1) {
        let dice = [];
        // Create an array of [action_count, act]. Need to know action_count to filter empty acts
        let act_move_counts = Object.fromEntries([1, 2, 3, 4, 5, 6].map((act) => [act, Object.keys(this.actor.system.moves[act]).length]));
        while (dice.length < count) {
            let remaining_valid_acts = Object.entries(act_move_counts).filter(([_act, count]) => count > 0).map(([act, _count]) => act);
            if (remaining_valid_acts.length == 0) {
                // Just roll randomly - they'll get to move, at least!
                dice.push(Math.ceil(Math.random() * 6));
            } else {
                // Roll within valid
                let act = remaining_valid_acts[Math.floor(Math.random() * remaining_valid_acts.length)];
                act_move_counts[act]--; // Deduct
                dice.push(act);
            }
        }
        return dice;
    }

    // Unset a die with the given number
    // Since is a sorted array, we don't care which
    unsetDie(value) {
        let found = this.system.set_dice.indexOf(value);
        if (found != -1) {
            let nv = [...this.system.set_dice];
            nv.splice(found, 1);
            return this.update({
                "system.set_dice": nv
            });
        }
    }

    // Clear all set dice
    clearDice() {
        return this.update({
            "system.set_dice": []
        });
    }

    // Easy check if we have any moves defined
    get hasMovesDefined() {
        return [1,2,3,4,5,6].some(act => this.actor.system.moves[act].length != 0);
    }

    get thumbnail() {
        //if ( combatant._videoSrc && !combatant.img ) {
        //if ( combatant._thumb ) return combatant._thumb;
        //return combatant._thumb = await game.video.createThumbnail(combatant._videoSrc, {width: 100, height: 100});
        //}
        return this.img ?? CONST.DEFAULT_TOKEN;
    }

    // Ping this combatant's token
    ping() {
        if (!canvas.ready || (this.sceneId !== canvas.scene.id)) return;
        const token = this.token?.object;
        if (!token || !token.visible) {
            ui.notifications.warn("COMBAT.WarnNonVisibleToken", { localize: true });
            return;
        }
        return canvas.ping(token.center);
    }

    // TODO: remove these
    // Helper shorthand. Do we own this combatant?
    get owner() {
        return this.permission >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER;
    }

    // Helper shorthand. Are we an owner or observer on this combatant. Todo: loft to document level, somehow?
    get observer() {
        return this.permission >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER;
    }

    // Helper shorthand. Is the token friendly?
    get friendly() {
        return (this.token?.disposition || 0) >= CONST.TOKEN_DISPOSITIONS.FRIENDLY;
    }

    // For determining if an npc's set die is visible for the given act
    get visible_dice() {
        // Determine if acts visible at the current phase of combat
        if (this.observer || this.friendly) {
            return this.system.set_dice;
        } else {
            // Depends on mode and combat state
            let combat = this.combat;
            let mode = game.settings.get(game.system.id, DOOMSONG.settings.combat.view_acts.key);
            switch (combat.system.phase) {
                default:
                case "begin":
                    return [];
                case "set":
                    return mode == "before_plan" ? this.system.set_dice : [];
                case "acts":
                    return mode == "after_plan" ? this.system.set_dice : (mode == "next_act" ? this.system.set_dice.filter(d => d <= combat.system.act) : []);
                case "retreat":
                case "end":
                    return this.system.set_dice;
            }
        }

    }

    // Generates html for a tooltip describing the moves available for a dice in a given act - but only if you can see them!
    actTooltip(act) {
        if (this.observer || this.friendly) {
            let moves = Object.values(this.actor.system.moves[act]);
            let items = moves.map(move => `<li>${move.name}: ${move.text}</li>`);
            return `<ul>${items.join("")}</ul>`;
        } else {
            // TODO: Allow revelation of enemy capabilities
            return "<span>This being's capabilities are unknown</span>";
        }
    }
}