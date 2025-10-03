<script>
    import Die from "./Die.svelte";
    import RollingDie from "./RollingDie.svelte";
    import crest from "$assets/icons/crest.png";
    import skull from "$assets/icons/skull.png";
    import { resultTables, suspense } from "../../utils/roll.svelte";
    /** @import { RollMessageData } from "../../utils/roll.svelte" */

    let { _id: id, author, speaker, flags, rolls, dsn_roll } = $props();

    /** @type {RollMessageData} */
    let roll_data = $derived(flags[game.system.id]);

    /** Reconstructed roll from the message
     * @type {Roll}
     */
    let roll = $derived(Roll.fromJSON(rolls[0]));

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
        resultTables()[roll_data.roll_type] ?? resultTables()["standard"],
    );

    let [result_key, result_entry] = $derived(result_table.resultFor(roll.total, roll_data.difficulty, roll_data.coin_result));
    let speaker_actor = $derived(ChatMessage.getSpeakerActor(speaker));

    // Modify this roll to have a flipped doomcoin. DSN integrated
    async function flipDoomcoin() {
        // Moves the result up or down by one
        let doomcoin = await suspense(new Roll("1d2"));
        let flip_value = doomcoin.total == 2 ? 1 : -1;
        return game.messages.get(id).update({
            [`flags.${game.system.id}.coin_result`]: flip_value,
        });
    }
</script>

<h2 class="doomsong">
    <span>{result_table.label} - {speaker_actor?.name}</span>
    {#if roll_data.coin_result == 0}
        <a
            class="doomcoin unflipped"
            onclick={flipDoomcoin}
            aria-label="Flip Doomcoin"><i class="fas fa-coin"></i></a
        >
    {:else if roll_data.coin_result == 1}
        <img class="doomcoin flipped" src={crest} alt="Crest" />
    {:else if roll_data.coin_result == -1}
        <img class="doomcoin flipped" src={skull} alt="Skull" />
    {/if}
</h2>
<div class="doomsong dice">
    {#each die_results as die}
        {#if dsn_roll == "rolling"}
            <RollingDie />
        {:else}
            <Die value={die.result} discarded={die.discarded} />
        {/if}
    {/each}
    <span>+</span>
    <span>{modifiers}</span>
    <span>→</span>
    <span class={["result", { rolling: dsn_roll == "rolling" }]}
        >{roll.total}</span
    >
</div>
<div class={["doomsong", "results", { certain: dsn_roll != "rolling" }]}>
    {#each Object.entries(result_table.results) as [table_result_key, table_result]}
        <div class="result-key">
            {#if table_result_key == "crest"}
                <img class="critical" src={crest} alt="Crest" />
            {:else if table_result_key == "skull"}
                <img class="critical" src={skull} alt="Skull" />
            {:else}
                <span>
                    {table_result_key.toLocaleUpperCase()}
                </span>
            {/if}
        </div>
        <div class={{ chosen: table_result_key == result_key }}>
            <p>
                <span class="label">{table_result.label}.</span>
                <span>{table_result.text}</span>
            </p>
        </div>
    {/each}
</div>

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

        &.certain .chosen {
            background-color: gray;
        }
    }
</style>
