<script>
    import TraitDisplay from "../../fields/TraitDisplay.svelte";
    import Die from "../../rolls/Die.svelte";
    import Shield from "../../combat/Shield.svelte";
    import Moves from "../../combat/Moves.svelte";
    let { context } = $props();
    let actor = $derived(context.actor);
</script>

<div class="frame-body">
    <div class="header">
        <div class="identity">
            <h1>{context.actor.name}</h1>
            <div class="traits">
                {#each actor.system.traits as trait, index}
                    {#if index > 0}
                        <span>•</span>
                    {/if}
                    <TraitDisplay {trait}></TraitDisplay>
                {/each}
            </div>
        </div>
        <Shield {actor} />
    </div>
    <div class="abilities">
        {#each actor.system.abilities as ability}
            <p class="ability">
                <span class="name">
                    {ability.name}.
                </span>
                <span class="text">
                    {ability.system.sorted_ranks[0]?.text}
                </span>
            </p>
        {/each}
    </div>
    <Moves style="width: 100%" {actor} moves={actor.system.moves} />
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
    }
</style>
