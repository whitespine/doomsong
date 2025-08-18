

export class DoomsongCombat extends Combat {
    // Advance this combat to the previous phase, or act within a phase
    nextPhase(skipEmptyActs = true) {
        if (this.system.phase == "acts") {
            // Advance within acts, if there are remaining 
            let new_act = this.system.act + 1;

            // Skip empty acts using combatantsByAct
            if (skipEmptyActs) {
                let cba = this.combatantsByAct;
                while (new_act <= 6 && cba[new_act].length == 0) new_act++;
            }

            // If new_act is now 7+, change phase to retreat instead. Leave act unchanged
            if(new_act > 6) {
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
            if(next == "acts") {
                if(skipEmptyActs) {
                    let cba = this.combatantsByAct;
                    update["system.act"] = [1,2,3,4,5,6].find(act => cba[act].length != 0) || 1; // it doesn't really matter what act we end up on if literally nobody has any dice. Just do 1
                } else {
                    update["system.act"] = 1; // Just do the first
                }
            }

            // Finally perform our update
            return this.update(update);
        }
    }

    // Unadvance this combat to the previous phase
    prevPhase(skipEmptyActs=true) {
        if (this.system.phase == "acts") {
            // Regress within acts, if there are remaining 
            let new_act = this.system.act - 1;

            // Skip empty acts using combatantsByAct
            if (skipEmptyActs) {
                let cba = this.combatantsByAct;
                while (new_act > 0 && cba[new_act].length == 0) new_act--;
            }

            // If new_act is now <= 0, change phase to set instead. Leave act unchanged - it'll just be overridden when we jump back
            if(new_act <= 0) {
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

            // Finally perform our update
            return this.update({
                "system.phase": prev
            });
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

    prevAct(skipEmpty = false) {
        return this.update({
            "system.act": this.system.act - 1
        });
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
    // TODO: make sure we have an action for it, maybe?
    randomDie() {
        return Math.ceil(Math.random * 6);
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

    // Set remaining dice as random, for if you're lazy / running a bestial npc / that's how that npc works
    fillRandomDice() {
        let to_add = [];
        for (let i = this.system.set_dice.length; i < this.system.available_dice; i++) {
            to_add.push(this.randomDie());
        }
        return this.setDice(...to_add);
    }

    // Clear all set dice
    clearDice() {
        return this.update({
            "system.set_dice": []
        });
    }

    // Easy check if we have any moves defined
    get hasMovesDefined() {
        return this.actor.system.moves.some(act_moves => act_moves.length != 0);
    }
}