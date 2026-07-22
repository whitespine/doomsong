<script>
    import ViewAnything from "./ViewAnything.svelte";

    let { message } = $props();

    /** @type {RollMessageData} */
    let flag_data = $derived(message.doomsong);

    let doc = $derived.by(() => {
        return fromUuid(flag_data.doc).then((doc_or_null) => {
            if (!doc_or_null) throw new Error("Bla!");
            return doc_or_null;
        });
    });

    function categoryFor(document) {
        if(document instanceof Item) {
            return "Item";
        } else if(document instanceof ActiveEffect) {
            return "Effect"; // Todo injury vs condition. We don't track which is which
        }
    }
</script>

<div class="doomsong">
    {#await doc}
        <span>...</span>
    {:then resolved_doc}
        <h2>{resolved_doc.actor?.name ?? "Someone"}'s {categoryFor(resolved_doc)}</h2>
        <ViewAnything doc={resolved_doc} chat={false} />
    {:catch e}
        <span
            >{message.speakerActor?.name ?? "???"} sent an item... but it's gone!</span
        >
    {/await}
</div>
