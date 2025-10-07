<script>
    import { stop } from "../../../utils/handlers";
    import EditAbility from "../../items/EditAbility.svelte";
    let { context } = $props();
    let actor = $derived(context.actor);
</script>

<div class="abilities">
    {#if Object.keys(actor.system.abilities).length == 0}
        <span>You have no abilities!</span>
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
