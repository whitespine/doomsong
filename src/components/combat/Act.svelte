<script>
    import Die from "../rolls/Dice.svelte";
    let { act, combat } = $props();
</script>

<div>
    <Die value={act} />
    <div class="flexcol">


    </div>
</div>

<style lang="scss">
    div {
        display: grid;
        grid-template: 1fr / 60px 1fr;
        justify-content: center;
        align-items: center;
    }
</style>
