<script>
    import Die from "../rolls/Die.svelte";
    let { context } = $props();
    let source = $derived(context.source);
    $inspect(context);
</script>

<div class="frame-body">
    <h1>{source.name}</h1>
    <div class="traits">
        {#each source.system.traits as trait}
            <span>{trait}</span>
        {/each}
    </div>
    <div class="traits"></div>
    <div class="acts">
        {#each [1, 2, 3, 4, 5, 6] as act}
            <div class="act">
                <Die value={act} />
                <div class="moves">
                    {#each Object.values(source.system.moves[act]) as move}
                        <p>
                            <span class="name">{move.name}:</span>
                            <span class="text">{move.text}</span>
                        </p>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>

<style lang="scss" module>
    .frame-body {
        display: flex;
        flex-direction: column;
        align-items: center;

        .acts, .traits {
            width: 100%;
        }

        .traits {
            border-bottom: solid black 2px;
        }

        .acts {
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
    }
</style>
