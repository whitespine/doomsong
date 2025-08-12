import './system.scss';

Hooks.once('init', async function() {

});

Hooks.once('ready', async function() {

});

// HMR reload of various components
if (import.meta.hot) {
  import.meta.hot.accept("./hooks/hotbar.mjs", module => {
    Hooks.off("hotbarDrop", hot_hooks.hotbar);
    hot_hooks.hotbar = Hooks.on("hotbarDrop", module.onHotbarDrop);
  });
}