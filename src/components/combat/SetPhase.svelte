<script>
    import SetPlanner from "./SetPlanner.svelte";
    import { mimic } from "../../utils/mimic";
    let { cc } = $props();
    let combatants = $derived(cc.combatants.map(c => mimic(c)));
</script>


<div class="flexcol">
    {#each combatants as combatant}
        <SetPlanner {combatant}> </SetPlanner>
    {/each}
</div>