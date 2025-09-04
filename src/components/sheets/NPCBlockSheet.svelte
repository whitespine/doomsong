<script>
    import Die from "../rolls/Die.svelte";
    let { context } = $props();
    let source = $derived(context.source);
    $inspect(context);
</script>

<div class="frame-body">
    <h1>{source.name}</h1>
    {#each [1, 2, 3, 4, 5, 6] as act}
        <div class="act">
            <Die value={act} />
            <div class="moves">
                {#each source.system.moves[act] as move}
                    <p>
                        <span class="name">{move.name}:</span>
                        <span class="text">{move.text}</span>
                    </p>
                {/each}
            </div>
        </div>
    {/each}
</div>

<style lang="scss" module>
    .frame-body {
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        .act {
            display: flex;
            flex-direction: row;
            .moves {
                display: flex;
                flex-direction: column;
                .name {
                    font-weight: bold;
                }
            }
        }
    }
</style>
