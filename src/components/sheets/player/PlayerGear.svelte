<script>
    import { stop } from "../../../utils/handlers";

    import ViewGear from "../../items/ViewGear.svelte";
    import SortableDocumentList from "../../layout/SortableDocumentList.svelte";

    let { app, context } = $props();
    let actor = $derived(context.actor);
    let items = $derived(Array.from(context.actor.items.svelte.values()));
    let all_gear = $derived(items.filter((i) => i.type != "ability"));

    function createGear(e, type) {
        stop(e);
        actor.createEmbeddedDocuments("Item", [
            {
                type,
                name: `New ${type}`,
            },
        ]);
    }

    let ready_gear = $derived(all_gear.filter((i) => i.system.ready));
    let stowed_gear = $derived(all_gear.filter((i) => !i.system.ready));
</script>

<div class="container">
    <div class="row">
        {#snippet child(gear)}
            <ViewGear {gear} edit={true} />
        {/snippet}
        <div class="col-6 ready">
            <h1>
                Ready Gear
                {actor.system.ready_load}
                /
                {actor.system.ready_capacity}
            </h1>
            <SortableDocumentList
                {child}
                documents={ready_gear}
                update_callback={(updates) =>
                    actor.updateEmbeddedDocuments("Item", updates)}
                update_item_processor={(_) => ({ "system.ready": true })}
            />
        </div>
        <div class="col-6 stowed">
            <h1>
                Stowed Gear
                {actor.system.stowed_load} /
                {actor.system.stowed_capacity}
            </h1>
            <SortableDocumentList
                {child}
                documents={stowed_gear}
                update_callback={(updates) =>
                    actor.updateEmbeddedDocuments("Item", updates)}
                update_item_processor={(_) => ({ "system.ready": false })}
            />
        </div>
    </div>

    <div class="row">
        <button
            class="col-4"
            aria-label="Add Gear"
            onclick={(e) => createGear(e, "gear")}
        >
            Add Gear</button
        >
        <button
            class="col-4"
            aria-label="Add Weapon"
            onclick={(e) => createGear(e, "weapon")}
        >
            Add Weapon</button
        >
        <button
            class="col-4"
            aria-label="Add Armor"
            onclick={(e) => createGear(e, "armor")}
        >
            Add Armor</button
        >
    </div>
</div>
