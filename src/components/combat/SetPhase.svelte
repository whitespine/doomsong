<script>
    import { zip } from "../../utils/zip";
    import SetPlanner from "./SetPlanner.svelte";
    let { combat } = $props();
</script>


<div class="flexcol">
    {#each combat.combatants.svelte.values() as combatant}
        <SetPlanner {combat} {combatant}> </SetPlanner>
    {/each}
</div>