<script>
    import { stop } from "../../utils/handlers";
    import Die from "../rolls/Die.svelte";

    let { actor = null, moves, ...restProps } = $props();
    let acts_to_show = $derived.by(() => {
        return [1, 2, 3, 4, 5, 6].filter(
            (act) => Object.keys(moves[act]).length > 0,
        );
    });

    let combatant = $derived.by(() => {
        if (!actor) return null;
        let all_combatants = Array.from(
            game.combat?.combatants.svelte.values() ?? [],
        );
        return all_combatants.find((c) => c.actorId == actor._id);
    });

    /** @type {({[key: number]: number})}*/
    let setDiceCounts = $derived.by(() => {
        let counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        if (combatant) {
            for (let die of combatant.system.set_dice) {
                counts[die]++;
            }
        }
        return counts;
    });

    let anySetDice = $derived(!!combatant?.system.set_dice.length);

    function selectDie(act) {
        combatant?.setDice(act);
    }

    function deselectDie(act) {
        combatant?.unsetDie(act);
    }
</script>

<div class="acts" {...restProps}>
    {#each acts_to_show as act, displayed_act_index}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class={{
                act: true,
                grey: displayed_act_index % 2 == 0,
                clickable: !!combatant,
            }}
            onclick={(e) => (stop(e), selectDie(act))}
            oncontextmenu={(e) => (stop(e), deselectDie(act))}
        >
            {#each {length: setDiceCounts[act] || 1} as _, _i}
                <Die value={act} discarded={anySetDice && setDiceCounts[act] == 0} />
            {/each}
            <div class="moves">
                {#each Object.values(moves[act]) as move}
                    <p>
                        <span class="name">{move.name}:</span>
                        <span class="text">{move.text}</span>
                    </p>
                {/each}
            </div>
        </div>
    {/each}
</div>

<style lang="scss">
    .acts {
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        .act {
            flex-grow: 1;
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 5px;
            pointer-events: none;

            &.clickable {
                cursor: pointer;
                pointer-events: all;

                &:hover {
                    box-shadow: 0 0 5px 5px grey;
                }
            }

            &.grey {
                background-color: lightgray;
            }

            .moves {
                display: flex;
                flex-direction: column;
                .name {
                    font-weight: bold;
                }

                p {
                    margin: 0.1em;
                }
            }
        }
    }
</style>
