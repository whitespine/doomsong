<script>
    import { stop } from "../../utils/handlers";
    let { doc = null, label = null } = $props();
    let fallback_label = $derived(label ?? `Send ${doc?.name || ""} to chat`);

    let speaker = $derived(doc.actor ?? null);

    function sendToChat(e) {
        stop(e);
        ChatMessage.create({
            speaker: speaker ?? ChatMessage.getSpeaker(),
            // Doomsong specific sauce
            [`flags.${game.system.id}`]: {
                type: "item",
                doc: doc.uuid
            },
        });
    }
</script>

<button
    onclick={sendToChat}
    aria-label={fallback_label}
    data-tooltip={fallback_label}
>
    <i class="fas fa-message"> </i>
</button>

<style lang="scss">
    button {
        margin: 2px;
        aspect-ratio: 1 / 1;
    }
</style>
