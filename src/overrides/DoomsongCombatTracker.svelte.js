import DoomsongCombatTrackerComponent from '../components/combat/CombatTracker.svelte'
import { SvelteApplicationMixin } from './svelte_mixin.svelte';

export class DoomsongCombatTracker extends SvelteApplicationMixin(foundry.applications.sidebar.AbstractSidebarTab) {

    static DEFAULT_OPTIONS = {
        window: {
            title: "COMBAT.SidebarTitle"
        },
        svelte: {
            component: DoomsongCombatTrackerComponent
        },
        classes: ["doomsong"]
    }

    static tabName = "combat";

    /*
    get viewed() {
        if (this.isPopout) return ui.combat.viewed;
        return this.#viewed;
    }

    set viewed(combat) {
        if (this.isPopout) ui.combat.viewed = combat;
        else {
            // if (combat !== this.#viewed) this.#highlighted = null;
            this.#viewed = combat || null;
        }
    }

    #viewed = null;
    */
    get viewed() {
        return game.combats.find(x => x.active);
    }

    // Hook us into the render updates. Don't need anything else
    async _onFirstRender(context, options) {
        await super._onFirstRender(context, options);
        if (!this.isPopout) game.combats.apps.push(this);
    }

    async _prepareContext() {
        let combat = game.combats.find(x => x.active);
        return {
            combat,
            source: combat ? foundry.utils.duplicate(combat._source) : {}
        };
    }

    // Required method
    _isTokenVisible(token) {
        return token.visible;
    }

    hoverCombatant(combatant, hovered) {
        this.props.highlighted = hovered ? combatant : null;
    }

    /*async _render(force = false, options = {}) {
        options.resizable ??= this.popOut;
        await svelte_render_override(this, DoomsongCombatTrackerComponent, () => {
            let wrapper = document.createElement("section");
            wrapper.id = "combat";
            for (let c of ["tab", "sidebar-tab", "combat-sidebar"]) {
                wrapper.classList.add(c);
            }
            wrapper.setAttribute("data-tab", "combat");
            globalThis.$("template#combat").replaceWith(wrapper);
            return wrapper
        }, force, options);
    }*/


    /** @inheritDoc */
    /*
    async _onFirstRender(context, options) {
        await super._onFirstRender(context, options);
        if (!this.isPopout) game.combats.apps.push(this);

        // Combatant context menu
        /** @fires {hookEvents:getCombatantContextOptions} */
    /*
    this._createContextMenu(this._getEntryContextOptions, ".combatant", { fixed: true });

    // Combat controls menu
    if (game.user.isGM) {
        /** @fires {hookEvents:getCombatContextOptions} */
    /*
        this._createContextMenu(this._getCombatContextOptions, ".encounter-context-menu", {
            eventName: "click",
            fixed: true,
            hookName: "getCombatContextOptions",
            parentClassHooks: false
        });
    }
}
    */

    /*
    async getData(options={}) {
        console.log(options);
        super.getData(options);
    }
    */
}