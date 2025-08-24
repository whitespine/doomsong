import configuration from "./configuration.json"; 
import events from "./events.json";

export async function initCalendar() {
    // Do base init
    await SimpleCalendar.api.configureCalendar(configuration);

    // Add every event
    for (let evt of events) {
        await SimpleCalendar.api.addNote(
            evt.title, 
            evt.content, 
            evt.startDate, 
            evt.endDate || evt.startDate, // Default to a full day on the same day 
            evt.allDay || true, // Default to an all day event
            evt.repeats || 3, // Default to repeating yearly
            evt.categories || [], // Default no calendar
            undefined, undefined, 
            evt.userVisibility ? (Array.isArray(evt.userVisibility) ? evt.userVisibility : [evt.userVisibility]) : [], // Coerce to array. Default to empty. "default" allows players to see too
            evt.remindUsers);
    }
}