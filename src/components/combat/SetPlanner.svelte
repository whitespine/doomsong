<script>
    import Die from "../rolls/Dice.svelte";
    let { cc, combatant } = $props();
</script>

<div class="planner">
    <div class="dice-box">
        {#each [1,2,3,4,5,6] as value}
            <Die {value} onclick={() => console.log(value)} />
        {/each}
    </div>
</div>

<style lang="scss">
    .planner {
        display: grid;
        grid-template: 1fr / 64px 1fr 128px;
    }

    .dice-box {
        display: grid;
        grid-template: 1fr / repeat(6, 1fr);
        justify-content: center;
        align-items: center;
    }
</style>
