

export class DoomsongCombat extends Combat {
    // Advance this combat to the previous phase
    nextPhase() {
        let next = {
            "begin": "set",
            "set": "acts",
            "acts": "retreat",
            "retreat": "end",
            "end": "begin",
        }[this.system.phase] || "begin";
        return this.update({
            "system.phase": next,
            "system.act": 1 // Changing phase always resets act
        });
    }

    // Unadvance this combat to the previous phase
    prevPhase() {
        let prev = {
            "set": "begin",
            "acts": "set",
            "retreat": "acts",
            "end": "retreat",
            "begin": "end",
        }[this.system.phase] || "begin";
        return this.update({
            "system.phase": prev,
            "system.act": 1 // Changing phase always resets act
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
        for(let value of values) {
            if(current.length < this.system.available_dice) {
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
        if(found != -1) {
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
        for(let i=this.system.set_dice.length; i<this.system.available_dice; i++) {
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
}