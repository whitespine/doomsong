<script>
    import ViewAbility from "../../items/ViewAbility.svelte";
    let { context } = $props();
    let actor = $derived(context.actor);
</script>

<div class="abilities">
    {#if Object.keys(actor.system.abilities).length == 0}
        <span>You have no abilities!</span>
    {/if}
    {#each actor.system.abilities as ability}
        <ViewAbility {ability} />
    {/each}
</div>

<style lang="scss">
    .abilities {
        display: flex;
        flex-direction: column;
    }
</style>
