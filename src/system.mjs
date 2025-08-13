import './system.scss';
import { setupSettings } from './settings';
import { DOOMSONG } from './consts';
import { initCalendar } from './integrations/calendar/calendar';
import { setupModels } from './models/config';
import { setupDocuments } from './documents/config';
import { initPdfPager } from './integrations/pdf/pager';
import { retry, sleep } from './utils/time';
import { mount } from 'svelte';
import Roller from "./components/roller.svelte";

Hooks.once('init', async function() {
  console.log("Initializing DOOMSONG RPG")
  setupDocuments();
  setupModels();
  setupSettings();
  // CONFIG.debug.hooks = true;
});

// Setup calendar
Hooks.once('simple-calendar-ready', async function() {
  let need_init_calendar = !game.settings.get(game.system.id, DOOMSONG.settings.init.calendar);
  if (need_init_calendar) {
    await initCalendar().then(async () => {
      await game.settings.set(game.system.id, DOOMSONG.settings.init.calendar, true);
      ui.notifications.info("Initialized calendar");
    });
  }
});

// Setup pdf character sheet. Provide your own? Or do we bundle?
Hooks.once('ready', async function() {
  await retry(async () => {
    let need_init_pdf = !game.settings.get(game.system.id, DOOMSONG.settings.init.pdf);
    console.error("NEED INIT", need_init_pdf);
    if (need_init_pdf) {
      await initPdfPager().then(async () => {
        await game.settings.set(game.system.id, DOOMSONG.settings.init.pdf, true);
        ui.notifications.info("Initialized pdf character sheets");
      });
    } else {
      console.log("Skipping pdf initialization, as it has been completed");
    }
  }, 1000, 10);
});

// Mount our ui components
Hooks.once('ready', async function() {
  let ui = document.querySelector("#ui-bottom");
  mount(Roller, {
    target: ui
  });
})

// HMR reload of various components
if (import.meta.hot) {
  /*
  import.meta.hot.accept("./hooks/hotbar.mjs", module => {
    Hooks.off("hotbarDrop", hot_hooks.hotbar);
    hot_hooks.hotbar = Hooks.on("hotbarDrop", module.onHotbarDrop);
  });
  */
}