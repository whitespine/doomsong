<script>
    import { zip } from "../../utils/zip";
    import SetPlanner from "./SetPlanner.svelte";
    let { combat, source } = $props();
</script>


<div class="flexcol">
    {#each zip(combat.combatants.contents, source.combatants) as [combatant, combatant_source]}
        <SetPlanner {combat} combat_source={source} {combatant} source={combatant_source}> </SetPlanner>
    {/each}
</div>