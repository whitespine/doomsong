import { mount } from 'svelte';
import RollMessage from '../components/rolls/RollMessage.svelte'
import { sleep } from '../utils/time';


export class DoomsongChatMessage extends ChatMessage {
    // Populate this as the specified component. Cannot be changed once populated
    async populateAsComponent(component) {
        const data = this.toObject(false);
        console.error(data);
        if (this._svelte_wrapper) {
            // Update props, no other action necessary
            Object.assign(this._svelte_props, data);
        } else {
            // Instantiate props
            let props = $state(data);
            this._svelte_wrapper = document.createElement("li");
            this._svelte_wrapper.classList.add("chat-message")
            mount(component, { props: props, target: this._svelte_wrapper })
        }

        // Expects jquery format
        await sleep(100);
        return globalThis.$(this._svelte_wrapper);
    }

    // For doomsong rolls, we have a custom svelte component :)
    async getRollHTML() {
        return this.populateAsComponent(RollMessage);
    }

    // Override base function
    async getHTML() {
        if (this.flags[game.system.id]?.["type"] == "roll") {
            return this.getRollHTML();
            // Todo support other types of rolls
        } else {
            return super.getHTML();
        }
    }
}