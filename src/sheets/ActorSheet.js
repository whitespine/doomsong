import { svelte_render_override } from "../overrides/svelte_application_utils.svelte";

export class DoomsongActorSheet extends ActorSheet {
    async _render(force = false, options = {}) {
        // Never submit? I think
        options.submit = false;
        options.submitOnClose = false;

        await svelte_render_override(this, this.componentToMount, () => {
            let wrapper = document.createElement("div");
            return wrapper
        }, force, options);

        this.object.apps[this.appId] = this;
    }

    get componentToMount() {
        throw new TypeError("Do not instantiate this class directly");
    }
}