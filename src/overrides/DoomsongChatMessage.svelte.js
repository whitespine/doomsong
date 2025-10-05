import { mount, unmount } from 'svelte';
import RollMessage from '../components/rolls/RollMessage.svelte'


const DOOMSONG_MESSAGE_IDS = new Set();

export class DoomsongChatMessage extends ChatMessage {
    // State
    doomsong = $state({});
    _svelte_wrappers = {};
    _svelte_components = {};

    // Populate this as the specified component. Cannot be changed once populated
    async populateAsComponent(component, mode) {
        this.doomsong = this.flags[game.system.id];

        if (!this._svelte_wrappers[mode]) {
            // Instantiate props
            let wrapper =  document.createElement("li")
            this._svelte_wrappers[mode] = wrapper;
            wrapper.classList.add("chat-message")
            this._svelte_components[mode] = mount(component, { props: {
                message: this
            }, target: wrapper });
        }

        return this._svelte_wrappers[mode];
    }

    // For doomsong rolls, we have a custom svelte component :)
    async getRollHTML(mode) {
        return this.populateAsComponent(RollMessage, mode);
    }

    // Override base function
    async renderHTML(options={}) {
        let popup = options.canDelete === false;
        let mode = popup ? "popup" : "message";
        if (this.flags[game.system.id]?.["type"] == "roll") {
            return this.getRollHTML(mode);
        } else {
            return super.renderHTML();
        }
    }
}

// Disable inbuilt DSN roll display for doomsong messages. We do these manually
Hooks.on('diceSoNiceRollStart', (messageId, context) => {
    //Hide this roll
    if(game.messages.get(messageId)?.flags[game.system.id]?.["type"] == "roll") {
        context.blind=true;
    }
});


// Create a cleanup hook
Hooks.on("deleteChatMessage", (message) => {
    if(message._svelte_component) {
        for(let [k, v] of Object.entries(message._svelte_wrappers)) {
            unmount(message._svelte_components[k]);
            globalThis.$(v).remove();
        }
    }
});