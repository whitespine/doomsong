<script>
    import TraitDisplay from "../fields/TraitDisplay.svelte";
    import Die from "../rolls/Die.svelte";
    import Shield from "../combat/Shield.svelte";
    let { context } = $props();
    let source = $derived(context.source);
    let acts_to_show = $derived.by(() => {
        return [1, 2, 3, 4, 5, 6].filter(
            (act) => Object.keys(source.system.moves[act]).length > 0,
        );
    });
</script>

<div class="frame-body">
    <div class="header">
        <div class="identity">
            <h1>{context.actor.name}</h1>
            <div class="traits">
                {#each source.system.traits as trait, index}
                    {#if index > 0}
                        <span>•</span>
                    {/if}
                    <TraitDisplay {trait}></TraitDisplay>
                {/each}
            </div>
        </div>
        <Shield context={context}></Shield>
    </div>
    <div class="abilities">
        {#each Object.entries(source.system.abilities) as [ability_id, ability]}
            <p class="ability">
                <span class="name">
                    {ability.name}.
                </span>
                <span class="text">
                    {ability.level_text[0]}
                </span>
            </p>
        {/each}
    </div>
    <div class="acts">
        {#each acts_to_show as act, displayed_act_index}
            <div class="act" class:grey={displayed_act_index % 2 == 0}>
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

        .header,
        .acts,
        .abilities,
        .traits {
            width: 100%;
        }

        .header {
            display: flex;
            flex-direction: row;
            border-bottom: solid black 2px;
            align-items: center;

            .identity {
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                .traits {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    padding-bottom: 10px;

                    span {
                        margin-left: 2px;
                        margin-right: 2px;
                    }
                }
            }
        }

        .abilities {
            .name {
                font-weight: bolder;
            }
        }

        .acts {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-around;

            .act {
                flex-grow: 1;
                display: flex;
                flex-direction: row;
                align-items: center;
                padding: 5px;

                &.grey {
                    background-color: lightgray;
                }

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
