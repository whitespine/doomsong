<script>
    import Dice from "./Dice.svelte";
    import roll_types from "./roll_types.json";
    import RollingDice from "./RollingDice.svelte";
    let { _id: id, author, speaker, flags, rolls, dsn_roll } = $props();
    let ds_data = $derived(flags[game.system.id]);
    let roll = $derived(Roll.fromJSON(rolls[0]));
    let die_results = $derived(roll.dice[0].results);
    let modifiers = $derived(roll.total - roll.dice[0].total); // Dumb hack, easier
    let roll_type = $derived(
        roll_types[ds_data.roll_type] || roll_types["STANDARD"],
    );
    let roll_result = $derived.by(() => {
        let total = roll.total;
        let difficulty = ds_data.difficulty;
        let base;
        if (total < difficulty) {
            base = 1;
        } else if (total == difficulty) {
            base = 2;
        } else {
            base = 3;
        }
        let final_result = base + ds_data.coin_result;
        return ["skull", "under", "equal", "over", "crest"][final_result];
    });
    let speaker_actor = $derived(ChatMessage.getSpeakerActor(speaker));

    async function flipDoomcoin() {
        // Moves the result up or down by one
        let doomcoin = await new Roll("1d2").roll();
        let flip_value = doomcoin.total == 2 ? 1 : -1;
        let dsn_promise = game.dice3d
            ? game.dice3d.showForRoll(doomcoin, game.user, true)
            : Promise.resolve(true);
        dsn_promise.then(() => {
            return game.messages.get(id).update({
                [`flags.${game.system.id}.coin_result`]: flip_value,
            });
        });
    }
</script>

<h2 class="doomsong">
    <span>{roll_type.label} - {speaker_actor?.name}</span>
    {#if ds_data.coin_result == 0}
        <a class="doomcoin unflipped" onclick={flipDoomcoin} aria-label="Flip Doomcoin"
            ><i class="fas fa-coin"></i></a
        >
    {:else if ds_data.coin_result == 1}
        <img
            class="doomcoin flipped"
            src="systems/doomsong/assets/icons/crest.png"
            alt="Crest"
        />
    {:else if ds_data.coin_result == -1}
        <img
            class="doomcoin flipped"
            src="systems/doomsong/assets/icons/skull.png"
            alt="Skull"
        />
    {/if}
</h2>
<div class="doomsong dice">
    {#each die_results as die, index}
        {#if dsn_roll == "rolling"}
            <RollingDice />
        {:else}
            <Dice value={die.result} discarded={die.discarded} />
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
    {#each Object.entries(roll_type["results"]) as [result_key, result_text]}
        <div>
            {#if result_key == "crest"}
                <img
                    class="critical"
                    src="systems/doomsong/assets/icons/crest.png"
                    alt="Crest"
                />
            {:else if result_key == "skull"}
                <img
                    class="critical"
                    src="systems/doomsong/assets/icons/skull.png"
                    alt="Skull"
                />
            {:else}
                <span>
                    {result_key.toLocaleUpperCase()}
                </span>
            {/if}
        </div>
        <div class={{ chosen: result_key == roll_result }}>
            <span>
                {result_text}
            </span>
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
            justify-content: center;
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
