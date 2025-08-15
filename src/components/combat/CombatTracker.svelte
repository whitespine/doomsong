<script>
    import Act from "./Act.svelte";

    let props = $props();
    let current_combat = $derived(props.combats[props.currentIndex] || null);
    $inspect(props);
</script>


<ol id="combat-tracker" class="directory-list">
    {#each [1,2,3,4,5,6] as act}
    <Act {act} combat={current_combat}>

    </Act>
    {/each}
</ol>


<style lang="scss">
    .combat-control,
    .combatant-control {
        cursor: pointer;
    }

    img {
        max-width: 64px;
        max-height: 64px;
    }
</style>
