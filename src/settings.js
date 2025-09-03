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

    // Combat view options
    game.settings.register(game.system.id, DOOMSONG.settings.combat.view_acts, {
        name: "Show enemy Acts",
        hint: "When, if ever, to show when enemies intend to act",
        scope: 'world',
        type: String,
        config: true,
        choices: DOOMSONG.settings.combat.view_actions.options,
        default: "never"
    });

    game.settings.register(game.system.id, DOOMSONG.settings.combat.view_actions, {
        name: "Show enemy actions",
        hint: "When, if ever, to show what acts an enemy is capable of",
        scope: 'world',
        type: String,
        config: true,
        choices: DOOMSONG.settings.combat.view_actions.options,
        default: "never"
    });
}