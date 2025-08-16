import { mount } from 'svelte';
import DoomsongCombatTrackerComponent from '../components/combat/CombatTracker.svelte'

export class DoomsongCombatTracker extends CombatTracker {
    async _render(force = false, options = {}) {
        // Do not render under certain conditions
        const states = Application.RENDER_STATES;
        this._priorState = this._state;
        if ([states.CLOSING, states.RENDERING].includes(this._state)) return;

        // Applications which are not currently rendered must be forced
        if (!force && (this._state <= states.NONE)) return;

        // Begin rendering the application
        if ([states.NONE, states.CLOSED, states.ERROR].includes(this._state)) {
            console.log(`${vtt} | Rendering ${this.constructor.name}`);
        }
        this._state = states.RENDERING;

        // Merge provided options with those supported by the Application class
        foundry.utils.mergeObject(this.options, options, { insertKeys: false });
        options.focus ??= force;

        // Get the existing HTML element and application data used for rendering
        const element = this.element;
        // this.appId = element.data("appid") ?? ++_appId;
        if (this.popOut) ui.windows[this.appId] = this;
        const data = await this.getData(this.options);

        // Store scroll positions
        // if ( element.length && this.options.scrollY ) this._saveScrollPositions(element);

        // Render the inner content
        // const inner = await this._renderInner(data);
        // let html = inner;

        if (this._svelte_props) {
            // Update
            // Object.assign(this._svelte_props, data)
        } else {
            // Initialize
            let data_state = $state(data)
            this._svelte_props = data_state;
        }

        // If the application already exists in the DOM, ~~replace the inner content~~ update its props
        if (element.length) {
            if (!this._mounted) {
                mount(DoomsongCombatTrackerComponent, {
                    target: element[0],
                    props: this._svelte_props
                });
                this._mounted = true;
            }
            // this._replaceHTML(element, html);
            // Otherwise render a new app
        } else {
            // Wrap a popOut application in an outer frame
            if (this.popOut) {
                let outer = await this._renderOuter();
                this._svelte_wrapper = outer.find(".window-content")[0];
                this._injectHTML(outer);
            } else {
                this._svelte_wrapper = document.createElement("div");
                this._injectHTML(globalThis.$(wrapper));
            }
            this._svelte_component = mount(DoomsongCombatTrackerComponent, {
                target: this._svelte_wrapper,
                props: this._svelte_props
            });
        }
        // }

        // Irrelevant for us
        // if ( !this.popOut && this.options.resizable ) new Draggable(this, html, false, this.options.resizable);

        // Activate event listeners on the inner HTML
        // this._activateCoreListeners(inner);
        // this.activateListeners(inner);

        // Set the application position (if it's not currently minimized)
        if (!this._minimized) {
            foundry.utils.mergeObject(this.position, options, { insertKeys: false });
            this.setPosition(this.position);
        }

        // Apply focus to the application, maximizing it and bringing it to the top
        if (this.popOut && (options.focus === true)) this.maximize().then(() => this.bringToTop());

        // Dispatch Hooks for rendering the base and subclass applications
        // TODO: Find a way to implement
        // this._callHooks("render", html, data);

        // Restore prior scroll positions
        // if ( this.options.scrollY ) this._restoreScrollPositions(html);
        this._state = states.RENDERED;
    }

    async _renderInner(data) {

    }
}