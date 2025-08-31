<script>
    import Frame from "../layout/Frame.svelte";
    import Die from "../rolls/Die.svelte";
    let { data, actor, app } = $props();
    $inspect(data);
</script>

<div class="frame-anchor">
    <Frame>
        <div class="frame-body">
            {#each [1,2,3,4,5,6] as act}
                <Die value={act} />
            {/each}
        </div>
    </Frame>
</div>

<style lang="scss" module>

    .frame-body {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }

</style>
