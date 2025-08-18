import { mount, unmount } from "svelte";

export class SvelteDocumentSheet extends DocumentSheet {

}


// Call this in an overridden _render() 
// app is the Application we are overriding
// create_wrapper should create and mount the wrapper to the dom, then return the element
// component is the svelte component to mount
export async function svelte_render_override(app, component, create_wrapper, force = false, options = {}) {
  // Do not render under certain conditions
  const states = Application.RENDER_STATES;
  app._priorState = app._state;
  if ([states.CLOSING, states.RENDERING].includes(app._state)) return;

  // Applications which are not currently rendered must be forced
  if (!force && (app._state <= states.NONE)) return;

  // Begin rendering the application
  if ([states.NONE, states.CLOSED, states.ERROR].includes(app._state)) {
    console.log(`${vtt} | Rendering ${app.constructor.name}`);
  }
  app._state = states.RENDERING;

  // Merge provided options with those supported by the Application class
  foundry.utils.mergeObject(app.options, options, { insertKeys: false });
  options.focus ??= force;

  // Get the existing HTML element and application data used for rendering
  if (!app.appId) {
    // app.appId = Math.floor(Math.random() * 10000); // ++_appId;
    // let _appId = ++globalThis._appId;
    app.appId = ++globalThis._appId;
  }
  if (app.popOut) ui.windows[app.appId] = app;
  const data = await app.getData(app.options);

  // Instantiate, or update, props
  if (app._svelte_props) {
    // Update
    Object.assign(app._svelte_props, data)
  } else {
    // Initialize
    let data_state = $state(data);
    app._svelte_props = data_state;
  }

  // Instantiate & mount component if we have not done so already
  // TODO: Hhandle
  if (!app._element) {
    // Clean up old if it exists
    if (app._svelte_component) {
      unmount(app._svelte_component);
    }

    // Wrap a popOut application in an outer frame
    if (app.popOut) {
      let outer = await app._renderOuter();
      app._element = outer;
      app._svelte_wrapper = outer.find(".window-content")[0];
      app._injectHTML(outer);
    } else {
      // Otherwise rely on create_wrapper
      app._svelte_wrapper = create_wrapper();
      app._element = globalThis.$(app._svelte_wrapper);
    }

    // Mount it
    app._svelte_component = mount(component, {
      target: app._svelte_wrapper,
      props: app._svelte_props
    });
  }

  // TODO: re-implement resizability. Should be called on the result of create_wrapper I guess
  if (!app.popOut && app.options.resizable) new Draggable(app, app.element, false, app.options.resizable);

  // Set the application position (if it's not currently minimized)
  if (!app._minimized) {
    foundry.utils.mergeObject(app.position, options, { insertKeys: false });
    app.setPosition(app.position);
  }

  // TODO: re-enable
  // Apply focus to the application, maximizing it and bringing it to the top
  // if ( app.popOut && (options.focus === true) ) {
  // app.maximize().then(() => app.bringToFront());
  // }

  // Dispatch Hooks for rendering the base and subclass applications
  // this._callHooks("render", html, data);

  // Restore prior scroll positions
  // if ( this.options.scrollY ) this._restoreScrollPositions(html);
  app._state = states.RENDERED;
}