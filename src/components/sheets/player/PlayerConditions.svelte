<script>
    import { stop } from "../../../utils/handlers";

    import ViewEffect from "../../items/ViewEffect.svelte";
    import { DragArea } from "../../layout/dnd/dnd.svelte";
    import SortableDocumentListActorImpl from "../../layout/dnd/SortableDocumentListActorImpl.svelte";

    let { app, context } = $props();
    let actor = $derived(context.actor);
    let effects = $derived(Array.from(context.actor.effects.svelte.values()));
    let area = $derived(
        new DragArea({
            document_class: ActiveEffect,
            type: "effect",
            category: "wedontgrouptheseyet",
            collection: actor.effects,
        }),
    );

    function createCondition(e, type) {
        stop(e);
        actor.createEmbeddedDocuments("ActiveEffect", [
            {
                name: `New ${type}`,
                [`flags.${game.system.id}.show`]: true,
            },
        ]);
    }
</script>

<div class="container">
    <div class="row">
        {#snippet child(drag_effect)}
            <ViewEffect effect={drag_effect.doc} edit />
        {/snippet}
        <div class="col">
            <h1>Conditions</h1>
            <SortableDocumentListActorImpl
                {actor}
                {child}
                {area}
                documents={effects}
                type="effect"
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
