<script>
    import SetPlanner from "./SetPlanner.svelte";
    let { cc } = $props();
    let all_combatants = $derived(cc.val.combatants.contents);
      /*
    {#each all_combatants as combatant}
        <SetPlanner {cc} {combatant}> </SetPlanner>
    {/each}
    */
</script>


<h1>Set Dice</h1>
<div class="flexcol">

</div>