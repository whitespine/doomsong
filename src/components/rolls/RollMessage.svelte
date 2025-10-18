<script>
    import Die from "./Die.svelte";
    import RollingDie from "./RollingDie.svelte";
    import crest from "$assets/icons/crest.png";
    import skull from "$assets/icons/skull.png";
    import {
        FALLBACK_RESULT_TABLE,
        resultTables,
    } from "../../utils/roll.svelte";
    import { suspense, inSuspense } from "../../utils/suspense.svelte";
    /** @import { RollMessageData, ResultEntry } from "../../utils/roll.svelte" */

    let { message } = $props();

    /** @type {RollMessageData} */
    let roll_data = $derived(message.doomsong);

    /** Reconstructed roll from the message
     * @type {Roll}
     */
    let roll = $derived(message.rolls[0]);

    /** The values on our d6's
     * @type {number[]}
     */
    let die_results = $derived(roll.dice[0].results);

    /** The sum total of + or - to the roll
     * @type {number}
     */
    let modifiers = $derived(roll.total - roll.dice[0].total); // Dumb hack, easier

    /** The result table to pull from */
    let result_table = $derived(
        resultTables()[roll_data.roll_type] ?? FALLBACK_RESULT_TABLE,
    );

    let [base_result_key, base_result] = $derived(
        result_table.resultFor(roll.total, roll_data.difficulty, null),
    );
    let [final_result_key, _] = $derived(
        result_table.resultFor(
            roll.total,
            roll_data.difficulty,
            roll_data.coin_result,
        ),
    );

    /** @type {Array<[string, ResultEntry]>*/
    let entries_to_show = $derived.by(() => {
        let neighbors = result_table.neighborEntries(base_result_key);
        return [
            neighbors.below,
            [base_result_key, base_result],
            neighbors.above,
        ].filter((x) => x);
    });

    // Modify this roll to have a flipped doomcoin. DSN integrated
    async function flipDoomcoin() {
        // Moves the result up or down by one
        let doomcoin = await new Roll("1d2").roll();
        let flip_value = doomcoin.total == 2 ? 1 : -1;
        return game.messages.get(message.id).update({
            [`flags.${game.system.id}.coin_result`]: flip_value,
            [`flags.${game.system.id}.coin_suspense`]: suspense(doomcoin),
        });
    }
</script>

<h2 class="doomsong">
    <span>{result_table.label} - {message.speakerActor?.name ?? "???"}</span>
    {#if roll_data.coin_result == 0}
        <a
            class="doomcoin unflipped"
            onclick={flipDoomcoin}
            aria-label="Flip Doomcoin"
        >
            <i class="fas fa-coin"></i>
        </a>
    {:else if roll_data.coin_result == 1}
        <img class="doomcoin flipped" src={crest} alt="Crest" />
    {:else if roll_data.coin_result == -1}
        <img class="doomcoin flipped" src={skull} alt="Skull" />
    {/if}
</h2>
<div class="doomsong dice">
    {#each die_results as die}
        {#if inSuspense(roll_data.roll_suspense)}
            <RollingDie />
        {:else}
            <Die value={die.result} discarded={die.discarded} />
        {/if}
    {/each}
    <span>+</span>
    <span>{modifiers}</span>
    <span>→</span>
    <span class={["result", { rolling: inSuspense(roll_data.roll_suspense) }]}> {roll.total} </span>
</div>
{#if !inSuspense(roll_data.roll_suspense)}
    <div class="doomsong results">
        {#each entries_to_show as [result_key, result_entry]}
            <div class="result-key">
                {#if result_key == "crest"}
                    <img class="critical" src={crest} alt="Crest" />
                {:else if result_key == "skull"}
                    <img class="critical" src={skull} alt="Skull" />
                {:else}
                    <span>
                        {result_key.toLocaleUpperCase()}
                    </span>
                {/if}
            </div>
            <div class={{ chosen: (final_result_key == result_key) && !inSuspense(roll_data.coin_suspense) }}>
                <p>
                    <span class="label">{result_entry.label}.</span>
                    <span>{result_entry.text}</span>
                </p>
            </div>
        {/each}
    </div>
{/if}

<style lang="scss">
    h2 {
        display: flex;
        flex-direction: row;

        span {
            flex: 1;
        }

        .doomcoin {
            justify-self: flex-end;

            &.unflipped {
                cursor: pointer;
            }

            &.flipped {
                width: 1em;
                height: 1em;
            }
        }
    }

    .dice {
        display: flex;
        flex-direction: row;

        .rolling.result {
            opacity: 0%;
        }

        span {
            font-size: x-large;
            font-weight: bold;
            padding-inline: 5px;
        }
    }

    .results {
        display: grid;
        grid-template: 1fr / 70px 1fr;
        //align-items: center;
        align-content: center;
        background-color: black;
        gap: 1px;

        // Force critical icons to be centered
        div {
            height: 100%;
            width: 100%;
            background-color: white;
            padding: 5px;
            display: flex;
            align-items: center;
            &.result-key {
                justify-content: center;
            }

            .label {
                font-weight: bold;
            }

            .critical {
                width: 2em;
                height: 2em;
            }
        }

        .chosen {
            background-color: gray;
        }
    }
</style>
