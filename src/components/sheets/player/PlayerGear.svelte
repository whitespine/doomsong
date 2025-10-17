<script>
    import { DoomsongItem } from "../../../documents/item.svelte";
    import { stop } from "../../../utils/handlers";

    import ViewGear from "../../items/ViewGear.svelte";
    import ViewWeapon from "../../items/ViewWeapon.svelte";
    import { DragArea } from "../../layout/dnd/dnd.svelte";
    import SortableDocumentListActorImpl from "../../layout/dnd/SortableDocumentListActorImpl.svelte";

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

    let ready_area = $derived(
        new DragArea({
            document_class: DoomsongItem,
            type: "item",
            collection: actor.items,
            category: "ready",
        }),
    );
    let stowed_area = $derived(
        new DragArea({
            document_class: DoomsongItem,
            type: "item",
            collection: actor.items,
            category: "stowed",
        }),
    );

    let ready_gear = $derived(all_gear.filter((i) => i.system.ready));
    let stowed_gear = $derived(all_gear.filter((i) => !i.system.ready));
    let ready_overencumbered = $derived(
        actor.system.ready_load > actor.system.ready_capacity,
    );
    let stowed_overencumbered = $derived(
        actor.system.stowed_load > actor.system.stowed_capacity,
    );
</script>

<div class="container">
    <div class="row">
        {#snippet child(drag_gear)}
            {#if drag_gear.doc.type == "weapon"}
                <ViewWeapon weapon={drag_gear.doc} edit />
            {:else}
                <ViewGear gear={drag_gear.doc} edit />
            {/if}
        {/snippet}
        <div class="col-6 ready">
            <h1>
                Ready Gear
                {actor.system.ready_load}
                /
                {actor.system.ready_capacity}

                {#if ready_overencumbered}
                    <i
                        class="fas fa-warning"
                        data-tooltip="Overencumbered! Drag some items to your stowed gear, or leave them behind"
                    ></i>
                {/if}
            </h1>
            <SortableDocumentListActorImpl
                {actor}
                {child}
                documents={ready_gear}
                area={ready_area}
                update_mod={() => ({"system.ready": true})}
            />
        </div>
        <div class="col-6 stowed">
            <h1>
                Stowed Gear
                {actor.system.stowed_load} /
                {actor.system.stowed_capacity}
                {#if stowed_overencumbered}
                    <i
                        class="fas fa-warning"
                        data-tooltip="Overencumbered! Drag some items to your ready gear, or leave them behind"
                    ></i>
                {/if}
            </h1>
            <SortableDocumentListActorImpl
                {actor}
                {child}
                documents={stowed_gear}
                area={stowed_area}
                update_mod={() => ({"system.ready": false})}
            />
        </div>
    </div>

    <div class="row">
        <button
            class="col-4"
            aria-label="Add Gear"
            onclick={(e) => createGear(e, "gear")}
        >
            Add Gear
        </button>
        <button
            class="col-4"
            aria-label="Add Weapon"
            onclick={(e) => createGear(e, "weapon")}
        >
            Add Weapon
        </button>
        <button
            class="col-4"
            aria-label="Add Armor"
            onclick={(e) => createGear(e, "armor")}
        >
            Add Armor
        </button>
    </div>
</div>
