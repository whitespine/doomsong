<script>
    import SetPlanner from "./SetPlanner.svelte";
    let { combat, highlighted } = $props();
</script>


<div class="flexcol">
    {#each combat.combatants.svelte.values() as combatant}
        <SetPlanner {combat} {combatant} {highlighted}> </SetPlanner>
    {/each}
</div>