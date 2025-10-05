import './system.scss';
import { setupSettings } from './settings';
import { DOOMSONG } from './consts';
import { initCalendar } from './integrations/calendar/calendar';
import { setupModels } from './models/config';
import { initCombatSettings, initTokenSettings, setupDocuments } from './documents/config';
import { initPdfPager } from './integrations/pdf/pager';
import { retry, sleep } from './utils/time';
import { mount } from 'svelte';
import RollerButton from "./components/rolls/HotbarButton.svelte";
import { DoomsongCombatTracker } from './overrides/DoomsongCombatTracker.svelte';
import { DoomsongChatMessage } from './overrides/DoomsongChatMessage.svelte';
import { DoomsongActor } from './documents/actor.svelte';
import { DoomsongTokenDocument } from './documents/token';
import { setupSheets } from './sheets/config';
import { AttackFlowApp } from './apps/dodge_prompt.svelte';
import { injectAllCoreDocumentsReactivity, injectEmbeddedCollectionsReactivity } from './utils/reactor.svelte';

Hooks.once('init', async function () {
  console.log("Initializing DOOMSONG RPG")
  injectAllCoreDocumentsReactivity();
  injectEmbeddedCollectionsReactivity();
  setupDocuments();
  setupModels();
  setupSettings();
  setupSheets();
  CONFIG.ui.combat = DoomsongCombatTracker;
  // CONFIG.debug.hooks = true;
  document.documentElement.style.setProperty("--font-primary", `"IM Fell Double Pica", serif `);

  // Also setup a doomsong namespace for macros to use
  game.doomsong = {
    combat: {},
    documents: {
      actor: DoomsongActor,
      message: DoomsongChatMessage,
      token: DoomsongTokenDocument
    },
    apps: {
      attack: AttackFlowApp
    },
    calendar: {
      init: initCalendar
    }
  };
});

// Setup tokens
Hooks.once("ready", async function () {
  let need_init_tokens = !game.settings.get(game.system.id, DOOMSONG.settings.init.tokens);
  if (need_init_tokens) {
    await initTokenSettings().then(async () => {
      await game.settings.set(game.system.id, DOOMSONG.settings.init.tokens, true);
      ui.notifications.info("Initialized tokens");
    });
  }

  let need_init_combat = !game.settings.get(game.system.id, DOOMSONG.settings.init.combat);
  if (need_init_combat) {
    await initCombatSettings().then(async () => {
      await game.settings.set(game.system.id, DOOMSONG.settings.init.combat, true);
      ui.notifications.info("Initialized combat");
    });
  }
})

// Setup calendar
Hooks.once('simple-calendar-ready', async function () {
  let need_init_calendar = !game.settings.get(game.system.id, DOOMSONG.settings.init.calendar);
  if (need_init_calendar) {
    await initCalendar().then(async () => {
      await game.settings.set(game.system.id, DOOMSONG.settings.init.calendar, true);
      ui.notifications.info("Initialized calendar");
    });
  }
});

// Setup pdf character sheet. Provide your own? Or do we bundle?
Hooks.once('ready', async function () {
  await retry(async () => {
    let need_init_pdf = !game.settings.get(game.system.id, DOOMSONG.settings.init.pdf);
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
Hooks.once('ready', async function () {
  let ui_bottom = document.querySelector("#hotbar");
  mount(RollerButton, {
    target: ui_bottom
  });
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