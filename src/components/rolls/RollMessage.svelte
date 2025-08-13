<script>
    import roll_types from "./roll_types.json";
    let {
        author,
        speaker,
        flags,
        rolls
    } = $props();
    let ds_data = $derived(flags[game.system.id]);
    let roll = $derived(Roll.fromJSON(rolls[0]));
    let die_results = $derived(roll.dice[0].results);
    let modifiers = $derived(roll.total - roll.dice[0].total);  // Dumb hack, easier
    let roll_type = $derived(roll_types[ds_data.roll_type] || roll_types["STANDARD"]);
    let speaker_actor = $derived(ChatMessage.getSpeakerActor(speaker));
    // let author_user = $derived(User.get(author));

    // let author_user = $derived(gam)
</script>

<h2>
    <span>{roll_type.label} - {speaker_actor?.name}</span>
    <i class="fas fa-coin doomcoin"></i>
</h2>
<div class="results">
    {#each die_results as die, index}
        <span class={{discarded: die.discarded}}>{die.result}</span>
    {/each}
    <span>+</span>
    <span>{modifiers}</span>
    <span>→</span>
    <span>{roll.total}</span>
</div>


<style lang="scss">
    .container {
        background-image: url("ui/parchment.jpg");
        padding: 5px;
        margin-right: 10px;
        display: flex;
        flex-direction: column;
        z-index: calc(var(--z-index-ui) + 10);
        pointer-events: all;
    }

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

    .discarded {
        text-decoration: line-through;
    }

    .results {
        display: flex;
        flex-direction: row;

        span {
            font-size: x-large;
            font-weight: bold;
            padding-inline: 5px;
        }
    }

</style>