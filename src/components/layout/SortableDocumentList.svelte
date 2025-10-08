<script>
    import { flip } from "svelte/animate";
    import { dndzone } from "svelte-dnd-action";

    let {
        documents,
        update_callback,
        update_item_processor = null,
        child,
        flip_duration_ms = 300
    } = $props();

    let sorted_documents = $derived(documents.sort((a, b) => a.sort - b.sort));
    let wrapped_documents = $derived(
        sorted_documents.map((i) => ({
            id: i._id,
            doc: i,
        })),
    );

    function handleDndConsider(e) {
        wrapped_documents = e.detail.items;
    }

    function handleDndFinalize(e) {
        wrapped_documents = e.detail.items;

        // Do actual persisting
        let updates = e.detail.items.map((bundle, index) => {
            let base = update_item_processor
                ? update_item_processor(bundle.item)
                : {};
            return {
                ...base,
                _id: bundle.id,
                sort: index * 100,
            };
        });
        update_callback(updates);
    }
</script>

<div
    class="list"
    use:dndzone={{ items: wrapped_documents, flipDurationMs: flip_duration_ms }}
    onconsider={handleDndConsider}
    onfinalize={handleDndFinalize}
>
    {#each wrapped_documents as doc_wrapper (doc_wrapper.id)}
        <div animate:flip={{ duration: flip_duration_ms }}>
            {#if child}
                {@render child(doc_wrapper.doc)}
            {:else}
                <span>{doc_wrapper.id}</span>
            {/if}
        </div>
    {/each}
</div>

<style lang="scss">
    .list {
        height: 100%;
        min-height: 60px;
        display: flex;
        flex-direction: column;
    }
</style>
