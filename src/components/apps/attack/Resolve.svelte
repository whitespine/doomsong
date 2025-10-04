<script>
    import attack_img from "$assets/icons/attack.png";
    import Incrementer from "../../fields/Incrementer.svelte";
    import {
        FALLBACK_RESULT_TABLE,
        resultTables,
    } from "../../../utils/roll.svelte";
    import Consequence from "../../combat/Consequence.svelte";

    /** @import { AttackFlow } from "../../../apps/dodge_prompt.svelte" */

    /**
     * @type {{flow: AttackFlow, attacker: Actor, defender: Actor}}
     */
    let { flow, attacker, defender } = $props();

    let message = $derived(game.messages.get(flow.message_id));
    let [key, entry] = $derived.by(() => {
        if(!message) return [null]
        let roll_result = message?.rolls[0].total ?? -1;
        let coin = message?.doomsong.coin_result;
        let table = resultTables()[flow.attack.type] ?? FALLBACK_RESULT_TABLE;
        return table.resultFor(roll_result, flow.final_target, coin); // TODO support coin
    });
    let attacker_consequences = $derived(entry.penalties ?? []);
    let defender_consequences = $derived(entry.target_penalties ?? []);
</script>

<div>
    <div class="columns">
        <div class="column">
            <img src={attacker.img} />
        </div>
        <div class="column">
            <img src={defender.img} />
        </div>
    </div>
    <div class="desc">
        <p>
            <span class="bold"> {entry.label}. </span>
            {entry.text}
        </p>
    </div>
    <div class="columns">
        <div class="column participant">
            {#each attacker_consequences as consequence}
                <Consequence actor={attacker} {consequence} />
            {/each}
        </div>
        <div class="column participant">
            {#each defender_consequences as consequence}
                <Consequence actor={attacker} {consequence} />
            {/each}
        </div>
    </div>
</div>

<style lang="scss">
    .columns {
        display: flex;

        .column {
            flex: 50%;
        }
        .column:first-child {
            border-right: solid black 1px;
        }
    }

    .desc {
        border-bottom: solid black 1px;
        border-top: solid black 1px;
    }

    .bold {
        font-weight: bold;
    }

    .participant {
        display: flex;
        flex-direction: column;
    }
</style>
