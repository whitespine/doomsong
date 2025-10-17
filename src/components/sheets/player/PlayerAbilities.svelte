<script>
    import { stop } from "../../../utils/handlers";
    import ViewAbility from "../../items/ViewAbility.svelte";
    let { app, context } = $props();
    let actor = $derived(context.actor);
    let edit = $derived(app.isEditable);

    // Add a new blank ability
    function addAbility(e) {
        stop(e);
        actor.createEmbeddedDocuments("Item", [
            { type: "ability", name: "New Ability" },
        ]);
    }
</script>

<div class="abilities">
    {#if Object.keys(actor.system.abilities).length == 0}
        <span>You have no abilities!</span>
    {/if}
    {#each actor.system.abilities as ability}
        <ViewAbility {ability} {edit} />
    {/each}
    {#if edit}
        <button onclick={addAbility}>Add an Ability</button>
    {/if}
</div>

<style lang="scss">
    .abilities {
        display: flex;
        flex-direction: column;
    }
</style>
