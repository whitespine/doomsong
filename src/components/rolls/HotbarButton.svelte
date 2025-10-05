<script>
    import { RollerApp } from "../../apps/roll_app.svelte";
    function promptRoll() {
        let actor = ChatMessage.getSpeakerActor(ChatMessage.getSpeaker());
        if(!actor) {
            ui.notifications.error("Either select a token, or assign a character to your user.");
        } else {
            RollerApp.prompt(actor);
        }
    }
</script>

<button class="doomsong" onclick={promptRoll}>
    <span class="elevated">Roll</span>
</button>

<style lang="scss">
    button {
        --size: 60px;
        border: 3px solid white;
        background: black;
        color: white;
        width: var(--size);
        height: var(--size);
        border-radius: 6px;
    }
</style>
