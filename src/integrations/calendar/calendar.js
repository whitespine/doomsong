import configuration from "./configuration.json"; 
import events from "./events.json";

export async function initCalendar() {
    // Do base init
    await SimpleCalendar.api.configureCalendar(configuration);

    // Add every event
    for (let evt of events) {
        await SimpleCalendar.api.addNote(evt.title, evt.content, evt.startDate, evt.endDate, evt.allDay, evt.repeats, evt.categories, undefined, undefined, evt.userVisibility, evt.remindUsers);
    }
}