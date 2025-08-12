import './system.scss';
import { setupSettings } from './settings';
import { DOOMSONG } from './consts';
import { initCalendar } from './integrations/calendar/calendar';
import { setupModels } from './models/config';
import { setupDocuments } from './documents/config';
import { initPdfPager } from './integrations/pdf/pager';

Hooks.once('init', async function() {
  console.log("Initializing DOOMSONG RPG")
  setupDocuments();
  setupModels();
  setupSettings();
});

Hooks.once('ready', async function() {
  // Setup calendar
  let need_init_calendar = !game.settings.get(game.system.id, DOOMSONG.settings.init.calendar);
  if (need_init_calendar) {
    await initCalendar().then(async () => {
      await game.settings.set(game.system.id, DOOMSONG.settings.init.calendar, true);
      ui.notifications.info("Initialized calendar");
    });
  }

  // Setup pdf character sheet. Provide your own? Or do we bundle?
  let need_init_pdf = !game.settings.get(game.system.id, DOOMSONG.settings.init.pdf);
  if (need_init_pdf) {
    await initPdfPager().then(async () => {
      await game.settings.set(game.system.id, DOOMSONG.settings.init.pdf, true);
      ui.notifications.info("Initialized pdf character sheets");
    });
  }

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