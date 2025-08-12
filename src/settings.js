/**
 * Registers all system settings
 */
export function setupSettings() {
    // So we can migrate :)
    game.settings.register(game.system.id, DOOMSONG.settings.init.calendar, {
        name: "Initialize Calendar",
        scope: "world",
        config: false,
        type: Boolean,
        default: false,
    });    
}