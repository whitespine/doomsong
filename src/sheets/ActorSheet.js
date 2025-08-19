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

    // Helper for setting an image that also hits token
    async setImage(img) {
        const mm = "icons/svg/mystery-man.svg";
        let current_token;
        let update = {
            img: img
        };
        if(this.actor.token) {
            current_token = this.actor.token.texture.src;
        } else {
            current_token = this.actor.prototypeToken.texture.src;
        }
        let sync = this.actor.img == current_token || current_token == mm;
        if(!sync) {
            return this.actor.update(update);
        } else if(this.actor.token) {
            return this.actor.update(update).then(() => this.actor.token.update({
                "texture.src": img
            }));
        } else {
            // Sync em up
            update["prototypeToken.texture.src"] = img;
            return this.actor.update(update);
        }
    }

    // Stolen from foundry, modified
    async editImage(attr) {
        const current = foundry.utils.getProperty(this.document._source, attr);
        const defaultArtwork = this.document.constructor.getDefaultArtwork?.(this.document._source) ?? {};
        const defaultImage = foundry.utils.getProperty(defaultArtwork, attr);
        // const fp = new FilePicker.implementation({ // v13
        const fp = new FilePicker({
            current,
            type: "image",
            redirectToRoot: defaultImage ? [defaultImage] : [],
            callback: path => this.setImage(path),
            position: {
                top: this.position.top + 40,
                left: this.position.left + 10
            }
        });
        await fp.browse();
    }

    async getData(options={}) {
        let base = await super.getData();
        base.app = this;
        base.data = foundry.utils.duplicate(base.data);
        return base;
    }
}