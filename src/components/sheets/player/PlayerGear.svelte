<script>
    import { stop } from "../../../utils/handlers";

    import { flip } from "svelte/animate";
    import { dndzone } from "svelte-dnd-action";
    import ViewGear from "../../items/ViewGear.svelte";

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

    const flipDurationMs = 300;
    function handleDndConsider(e, category) {
        if(category == "ready") {
            ready_gear = e.detail.items;
        } else if(category == "stowed") {
            stowed_gear = e.detail.items;
        }
    }
    function handleDndFinalize(e, category) {
        if(category == "ready") {
            ready_gear = e.detail.items;
        } else if(category == "stowed") {
            stowed_gear = e.detail.items;
        }
    }

    let ready_gear = $derived(
        all_gear
            .filter((i) => i.system.ready)
            .map((i) => ({
                id: i._id,
                item: i,
            })),
    );
    let stowed_gear = $derived(
        all_gear
            .filter((i) => !i.system.ready)
            .map((i) => ({
                id: i._id,
                item: i,
            })),
    );
</script>

<div class="container">
    <div class="row">
        <div class="col-6 ready">
            <h1>
                Ready Gear
                {actor.system.ready_load}
                /
                {actor.system.ready_capacity}
            </h1>
            <div
                class="gearlist"
                use:dndzone={{ items: ready_gear, flipDurationMs }}
                onconsider={(e) => handleDndConsider(e, "ready")}
                onfinalize={(e) => handleDndFinalize(e, "ready")}
            >
                {#each ready_gear as drag_gear (drag_gear.id)}
                    <div animate:flip={{ duration: flipDurationMs }}>
                        <ViewGear gear={drag_gear.item} edit={true} />
                    </div>
                {/each}
            </div>
        </div>
        <div class="col-6 stowed">
            <h1>
                Stowed Gear
                {actor.system.stowed_load} /
                {actor.system.stowed_capacity}
            </h1>
            <div
                class="gearlist"
                use:dndzone={{ items: stowed_gear, flipDurationMs }}
                onconsider={(e) => handleDndConsider(e, "stowed")}
                onfinalize={(e) => handleDndFinalize(e, "stowed")}
            >
                {#each stowed_gear as drag_gear (drag_gear.id)}
                    <div animate:flip={{ duration: flipDurationMs }} >
                        <ViewGear gear={drag_gear.item} edit={true} />
                    </div>
                {/each}
            </div>
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

<style lang="scss">
    .gearlist {
        height: 100%;
    }
</style>
