import { DOOMSONG } from "./consts";

/**
 * Registers all system settings
 */
export function setupSettings() {
    // Have we succesfully initialized calendar?
    game.settings.register(game.system.id, DOOMSONG.settings.init.calendar, {
        name: "Initialize Calendar",
        scope: "world",
        config: false,
        type: Boolean,
        default: false,
    });    

    // Have we succesfully initialized token bars?
    game.settings.register(game.system.id, DOOMSONG.settings.init.tokens, {
        name: "Initialize Tokens",
        scope: "world",
        config: false,
        type: Boolean,
        default: false,
    });    

    // Have we succesfully initialized pdf pager?
    game.settings.register(game.system.id, DOOMSONG.settings.init.pdf, {
        name: "Initialize PDF",
        scope: "world",
        config: false,
        type: Boolean,
        default: false,
    });    
}