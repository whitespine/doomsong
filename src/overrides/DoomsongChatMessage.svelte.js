import { mount, unmount } from 'svelte';
import RollMessage from '../components/rolls/RollMessage.svelte'
import { sleep } from '../utils/time';


export class DoomsongChatMessage extends ChatMessage {
    // Populate this as the specified component. Cannot be changed once populated
    async populateAsComponent(component) {
        const data = this.toObject(false);
        if (this._svelte_wrapper) {
            // Update props, no other action necessary
            Object.assign(this._svelte_props, data);
        } else {
            // Instantiate props
            let props = $state(data);
            this._svelte_props = props;
            this._svelte_wrapper = document.createElement("li");
            this._svelte_wrapper.classList.add("chat-message")
            this._svelte_component = mount(component, { props: props, target: this._svelte_wrapper })
        }

        // Expects jquery format
        // await sleep(100);
        return this._svelte_wrapper;
    }

    // For doomsong rolls, we have a custom svelte component :)
    async getRollHTML() {
        console.log("Roll html");
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

// Create a cleanup hook
Hooks.on("deleteChatMessage", (message) => {
    if(message._svelte_component) {
        unmount(message._svelte_component);
        globalThis.$(message._svelte_wrapper).remove();
    }
});

Hooks.on("diceSoNiceRollStart", (message_id) => {
    let message = game.messages.get(message_id);
    if(message?._svelte_props) {
        message._svelte_props["dsn_roll"] = "rolling"; 
    }
});

Hooks.on("diceSoNiceRollComplete", (message_id) => {
    let message = game.messages.get(message_id);
    if(message?._svelte_props) {
        message._svelte_props["dsn_roll"] = "rolled"; 
    }
});