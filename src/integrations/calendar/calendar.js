import configuration from "./configuration.json"; 
import events from "./events.json";

export async function initCalendar() {
    // Do base init
    await SimpleCalendar.api.configureCalendar(configuration);

    // Clear ALL doomsong builtin notes.
    for(let note of SimpleCalendar.api.getNotes()) {
        if(note.flags[game.system.id]?.builtin) {
            await SimpleCalendar.api.removeNote(note._id);
        }
    }

    let gm_ids = game.users.filter(u => u.isGM).map(u => u._id);

    // Add every event
    for (let evt of events) {
        let entry = await SimpleCalendar.api.addNote(
            evt.title, 
            evt.content, 
            evt.startDate, 
            evt.endDate || evt.startDate, // Default to a full day on the same day 
            evt.allDay || true, // Default to an all day event
            evt.repeats || 3, // Default to repeating yearly
            evt.categories || [], // Default no calendar
            undefined, undefined, 
            evt.visibility == "public" ? ["default"] : gm_ids, // Coerce to array. Default to empty. "default" allows players to see too
            evt.remindUsers);
        
        entry.update({
            [`flags.${game.system.id}`]: {
                builtin: true
            }
        })
    }
}

// To force clear calendar
// SimpleCalendar.api.getNotes().forEach(note => SimpleCalendar.api.removeNote(note._id);) 