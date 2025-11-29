<script>
    import { targetedTokens } from "../../utils/target.svelte";
    import { currentAttackDifficulty, FALLBACK_RESULT_TABLE, formulaFor, resultTables, rollCheck } from "../../utils/roll.svelte";
    import { initiateAttack } from "../../apps/dodge_prompt.svelte";
    import Incrementer from "../fields/Incrementer.svelte";

    /** @import {RollerApp} from "../../apps/roll_app.svelte" */

    /**
     * @type {({ app: RollerApp })}
     */
    let { app } = $props();

    // Gives tooltips for a given value
    function valueTooltip(value) {
        return {
            "-1": "Hindering",
            "0": "Incidental",
            "1": "Helpful",
            "2": "Perfect",
            "3": "Perfect and Defining",
        }[value];
    }

    // Our default choices
    function defaultChoices() {
        return foundry.utils.mergeObject({
            traits: 0,
            gear: 0,
            conditions: 0,
            allies: 0,
            extras: 0,
        }, app.options.roll?.preset_choices ?? {});
    }

    // Our currently selected options
    let roll_type = $state(app.options.roll?.roll_type ?? "standard"); // Intended to be mutated
    let result_table = $derived(resultTables()[roll_type] ?? FALLBACK_RESULT_TABLE);
    let choices = $state(defaultChoices());
    let difficulty = $derived.by(() => {
        if (roll_type.includes("attack")) {
            return currentAttackDifficulty();
        }
        return app.options.roll?.difficulty ?? result_table.defaultDifficulty;
    });

    // Reset the above two to their default values
    function reset() {
        choices = defaultChoices();
        difficulty = 5;
    }

    // Button callback
    function setCategoryBonus(category, value) {
        choices[category] = value;
    }

    // Roll handler
    async function roll(mode) {
        let total_bonuses = choices.traits + choices.gear + choices.conditions + choices.allies + choices.extras;
        app._callback_on_close = false;
        if (
            roll_type.includes("attack") &&
            targetedTokens().length != 0
        ) {
            let flow = initiateAttack({
                targets: targetedTokens().map(t => t.document),
                attack: {
                    user: game.user.id,
                    attacker: app.actor.uuid,
                    type: roll_type,
                    formula: formulaFor(mode, total_bonuses),
                }
            });
            if(app.callback) app.callback(flow);
        } else {
            let formula = formulaFor(mode, total_bonuses);
            rollCheck({  roll_type, difficulty, formula }).then(result => {
                if(app.callback) app.callback(result.message)
            });
        }
        app.close();
    }
</script>

<div class="doomsong container">
    <div class="header">
        <select class="elevated" bind:value={roll_type}>
            {#each Object.entries(resultTables()) as [key, table]}
                <option value={key}>{table.label}</option>
            {/each}
        </select>
        <span class="elevated difficulty">Difficulty:</span>
        <Incrementer type="number" name="difficulty" min="0" bind:value={difficulty} width="140px" />
    </div>
    <div class="roll-options">
        {#each ["traits", "gear", "conditions", "allies"] as category}
            <div>
                <span>{game.i18n.localize(`DS.roll.${category}`)}:</span>
            </div>
            {#each [-1, 0, 1, 2, 3] as value}
                {#if value <= 2 || category == "traits"}
                    <button
                        onclick={() => setCategoryBonus(category, value)}
                        data-tooltip={valueTooltip(value)}
                        class={{ active: choices[category] == value }}
                    >
                        {value > 0 ? "+" : ""}{value}
                    </button>
                {:else}
                    <!-- Pardon my ugly svelte -->
                    {#if category == "gear"}
                        <div class="extra top">
                            <button
                                aria-label="Increase extra bonus"
                                onclick={() =>
                                    setCategoryBonus("extras", choices.extras + 1)}
                            >
                                <i class="fas fa-caret-up"></i>
                            </button>
                        </div>
                    {:else if category == "conditions"}
                        <div class="extra mid" data-tooltip="Other bonuses">
                            <span>
                                {game.i18n.localize(`DS.roll.extras`)}: 
                                {choices.extras > 0
                                    ? "+"
                                    : ""}{choices.extras}
                            </span>
                        </div>
                    {:else if category == "allies"}
                        <div class="extra bottom">
                            <button
                                aria-label="Decrease extra bonus"
                                onclick={() =>
                                    setCategoryBonus("extras", choices.extras - 1)}
                            >
                                <i class="fas fa-caret-down"></i>
                            </button>
                        </div>
                    {/if}
                {/if}
            {/each}
        {/each}
    </div>
    <div class="roll-buttons">
        <button onclick={() => roll("hasty")}
            >{roll_type.includes("attack") ? "Light" : "Hasty"}</button
        >
        <button onclick={() => roll("standard")}>Standard</button>
        <button onclick={() => roll("focused")}
            >{roll_type.includes("attack") ? "Heavy" : "Focused"}</button
        >
    </div>
</div>

<style lang="scss">
    .container {
        background-color: white;
        border: solid black 1px;
        padding: 5px;
        margin-right: 10px;
        display: flex;
        flex-direction: column;
        z-index: calc(var(--z-index-ui) + 10);
        pointer-events: all;
        color: black;
        margin: -1rem;
    }

    .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        border-bottom: 1px black solid;

        // Our difficulty selector
        select {
            flex-grow: 1;
            margin-right: 30px;
            font-size: larger;
        }
        .difficulty {
            padding-left: 5px;
            padding-right: 5px;
            font-weight: bolder;
            font-size: x-large;
        }
    }

    .roll-options {
        display: grid;
        grid-template: 1fr / 2fr repeat(4, 1fr) 2fr;
        align-items: center;
        justify-items: center;

        // Center text for modifiers
        div {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: end;
            align-items: center;

            span {
                font-weight: bold;
            }
        }

        // Our extra bonus modifier zone
        .extra {
            // margin: 1px;
            &.top,
            &.mid,
            &.bottom {
                border-left: 1px solid black;
            }
            &.mid {
                justify-content: center;
                font-size: large;
            }
        }

        // Buttons we want to be flush, like in the book
        button {
            cursor: pointer;
            font-size: large;
            box-shadow: none;
            width: 100%;

            outline: none;
            border-radius: 0px;
            border: none;
            padding: 0;
            background: none;
            color: black;

            &.active {
                color: white;
                background-color: black;
            }
        }
    }

    .roll-buttons {
        display: flex;
        flex-direction: row;

        button {
            flex-grow: 1;
        }
    }
</style>
