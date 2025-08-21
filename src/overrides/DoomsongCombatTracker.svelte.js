import DoomsongCombatTrackerComponent from '../components/combat/CombatTracker.svelte'
import { svelte_render_override } from './svelte_application_utils.svelte';

export class DoomsongCombatTracker extends CombatTracker {
    async _render(force = false, options = {}) {
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
    }

    /*
    async getData(options={}) {
        console.log(options);
        super.getData(options);
    }
    */
}