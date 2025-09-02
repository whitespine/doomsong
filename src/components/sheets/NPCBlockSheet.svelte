<script>
    import Die from "../rolls/Die.svelte";
    let { context } = $props();
</script>

<div class="frame-body">
    {#each [1, 2, 3, 4, 5, 6] as act}
        <Die value={act} />
    {/each}
</div>

<style lang="scss" module>
    .frame-body {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }
</style>
