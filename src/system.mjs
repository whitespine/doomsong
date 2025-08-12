import './system.scss';
import { setupSettings } from './settings';
import { DOOMSONG } from './consts';
import { initCalendar } from './integrations/calendar/calendar';
import { setupModels } from './models/config';
import { setupDocuments } from './documents/config';

Hooks.once('init', async function() {
  console.log("Initializing DOOMSONG RPG")
  setupDocuments();
  setupModels();
  setupSettings();
});

Hooks.once('ready', async function() {
  // Setup calendar
  if (!game.settings.get(game.system.id, DOOMSONG.settings.init.calendar)) {
    initCalendar().then(() => {
      game.settings.set(game.system.id, DOOMSONG.settings.init.calendar, true);
      ui.notifications.info("Initialized calendar");
    });
  }

  // Setup pdf character sheet. Provide your own? Or do we bundle?

});

// HMR reload of various components
if (import.meta.hot) {
  /*
  import.meta.hot.accept("./hooks/hotbar.mjs", module => {
    Hooks.off("hotbarDrop", hot_hooks.hotbar);
    hot_hooks.hotbar = Hooks.on("hotbarDrop", module.onHotbarDrop);
  });
  */
}