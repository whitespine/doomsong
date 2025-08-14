<script>
    import roll_types from "./roll_types.json";
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
        console.log("Flippy");
        let doomcoin = await new Roll("1d2").roll();
        let flip_value = doomcoin.total == 2 ? 1 : -1;
        let dsn_promise = game.dice3d ?  game.dice3d.showForRoll(doomcoin, game.user, true) : Promise.resolve(true);
        dsn_promise.then(() => {
            return game.messages.get(id).update({
                [`flags.${game.system.id}.coin_result`]: flip_value
            });
        });
    }
</script>

<h2>
    <span>{roll_type.label} - {speaker_actor?.name}</span>
    {#if ds_data.coin_result == 0}
       <a class="doomcoin" onclick={flipDoomcoin} aria-label="Flip Doomcoin"><i  class="fas fa-coin"></i></a>
    {:else if ds_data.coin_result == 1}
        <i class="fas fa-crown doomcoin"></i>
    {:else if ds_data.coin_result == -1}
        <i class="fas fa-skull doomcoin"></i>
    {/if}
</h2>
<div class={["dice", {rolling: dsn_roll == "rolling", flipping: dsn_roll == "flipping" }]}>
    {#each die_results as die, index}
        <span class={["die", { discarded: die.discarded }]}>{die.result}</span>
    {/each}
    <span>+</span>
    <span>{modifiers}</span>
    <span>→</span>
    <span class="result">{roll.total}</span>
</div>
<div class={["results", {certain: dsn_roll != "rolling"}]}>
    {#each Object.entries(roll_type["results"]) as [result_key, result_text]}
        <span>
            {result_key}
        </span>
        <span class={{ chosen: result_key == roll_result }}>
            {result_text}
        </span>
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
            cursor: pointer;
        }
    }

    .dice {
        display: flex;
        flex-direction: row;

        &.rolling .die,
        &.rolling .result {
            opacity: 0%;
        }

        .discarded {
            text-decoration: line-through;
        }
        span {
            font-size: x-large;
            font-weight: bold;
            padding-inline: 5px;
        }
    }

    .results {
        display: grid;
        grid-template: 1fr / 50px 1fr;
        //align-items: center;
        align-content: center;
        background-color: black;
        gap: 1px;

        > * {
            height: 100%;
            background-color: white;
            padding: 5px;
        }

        &.certain .chosen {
            background-color: gray;
        }
    }
</style>
