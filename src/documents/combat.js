

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
            "system.phase": next
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
            "system.phase": prev
        });
    }
}

export class DoomsongCombatant extends Combatant {
    
}