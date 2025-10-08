<script>
    import { stop } from "../../../utils/handlers";

    import ViewEffect from "../../items/ViewEffect.svelte";
    import SortableDocumentList from "../../layout/SortableDocumentList.svelte";

    let { app, context } = $props();
    let actor = $derived(context.actor);
    let effects = $derived(Array.from(context.actor.effects.svelte.values()));
    let dnd_key = foundry.utils.randomID();

    function createCondition(e, type) {
        stop(e);
        actor.createEmbeddedDocuments("ActiveEffect", [
            {
                name: `New ${type}`,
                [`flags.${game.system.id}.show`]: true
            },
        ]);
    }
</script>

<div class="container">
    <div class="row">
        {#snippet child(effect)}
            <ViewEffect {effect} edit={true} />
        {/snippet}
        <div class="col">
            <h1>Conditions</h1>
            <SortableDocumentList
                {child}
                documents={effects}
                type={dnd_key}
                update_callback={(updates) =>
                    actor.updateEmbeddedDocuments("ActiveEffect", updates)}
            />
        </div>
    </div>

    <div class="row">
        <button
            class="col-6"
            aria-label="Add Condition"
            onclick={(e) => createCondition(e, "condition")}
        >
            Add Condition
        </button>
        <button
            class="col-6"
            aria-label="Add Injury"
            onclick={(e) => createCondition(e, "injury")}
        >
            Add Injury
        </button>
    </div>
</div>
