import { mount, unmount } from 'svelte';
import RollMessage from '../components/rolls/RollMessage.svelte'


const DOOMSONG_MESSAGE_IDS = new Set();

export class DoomsongChatMessage extends ChatMessage {
    // State
    doomsong = $state({});

    // Populate this as the specified component. Cannot be changed once populated
    async populateAsComponent(component) {
        this.doomsong = this.flags[game.system.id];

        if (!this._svelte_wrapper) {
            // Instantiate props
            this._svelte_wrapper = document.createElement("li");
            this._svelte_wrapper.classList.add("chat-message")
            this._svelte_component = mount(component, { props: {
                message: this
            }, target: this._svelte_wrapper });
        }

        // Expects jquery format
        // await sleep(100);
        return this._svelte_wrapper;
    }

    // For doomsong rolls, we have a custom svelte component :)
    async getRollHTML() {
        return this.populateAsComponent(RollMessage);
    }

    // Override base function
    async renderHTML() {
        if (this.flags[game.system.id]?.["type"] == "roll") {
            return this.getRollHTML();
            // Todo support other types of rolls
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
        unmount(message._svelte_component);
        globalThis.$(message._svelte_wrapper).remove();
    }
});