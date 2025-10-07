<script>
    import { stop } from "../../../utils/handlers";
    import EditAbility from "../../items/EditAbility.svelte";
    let { context } = $props();
    let actor = $derived(context.actor);

    // Add a new blank ability
    function addAbility() {
        actor.createEmbeddedDocuments("Item", [{ type: "ability", name: "New Ability" }]);
    }
</script>

<div class="abilities">
    {#if Object.keys(actor.system.abilities).length == 0}
        <span>You have not added any abilities yet!</span>
    {/if}
    {#each actor.system.abilities as ability}
        <EditAbility {ability} />
    {/each}
    <button onclick={(e) => (stop(e), addAbility())}>Add an Ability</button>
</div>

<style lang="scss">
    .abilities {
        display: flex;
        flex-direction: column;
    }
</style>
