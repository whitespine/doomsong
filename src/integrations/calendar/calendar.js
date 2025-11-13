import configuration from "./configuration.json";
import events from "./events.json";

export async function initCalendar() {
    // Do base init
    await SimpleCalendar.api.configureCalendar(configuration);

    // Clear ALL doomsong builtin notes.
    let notes_to_remove = [];
    for (let note of SimpleCalendar.api.getNotes()) {
        if (note.flags[game.system.id]?.builtin) {
            notes_to_remove.push(note._id);
        }
    }
    await JournalEntry.deleteDocuments(notes_to_remove);
    console.log(`Deleting ${notes_to_remove.length} calendar events`)

    let gm_ids = game.users.filter(u => u.isGM).map(u => u._id);

    // Get or create folder
    let folder = game.journal.folders.find(x => x.name == "_simple_calendar_notes_directory");
    if (!folder) {
        folder = await Folder.create({ name: "_simple_calendar_notes_directory", type: "JournalEntry", sorting: "a" });
    }

    // Add every event
    let entries = [];
    for (let evt of events) {
        let ownership = Object.fromEntries(gm_ids.map(id => [id, CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER]));
        if (evt.visibility == "public") {
            ownership.default = CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER;
        }
        let entry = {
            name: evt.title,
            folder: folder._id,
            pages: [
                {
                    text: {
                        content: evt.content,
                        format: 1
                    },
                    name: "Details",
                    type: "text",
                }
            ],
            flags: {
                core: {
                    sheetClass: "foundryvtt-simple-calendar.NoteSheet"
                },
                "foundryvtt-simple-calendar": {
                    noteData: {
                        calendarId: "default",
                        startDate: {
                            ...evt.startDate
                        },
                        endDate: {
                            ...(evt.endDate ?? evt.startDate)
                        },
                        allDay: evt.allDay ?? true,
                        order: 0,
                        categories: evt.categories,
                        repeats: evt.repeats ?? 3, // Yearly by default
                        remindUsers: [],
                        macro: "none"
                    }
                },
                [game.system.id]: {
                    builtin: true
                }
            },
            ownership
        }
        entries.push(entry);
    }
    await JournalEntry.createDocuments(entries);
    console.log(`Creating ${entries.length} calendar entries`);
    ui.notifications.info("Calendar initialization complete");
}
