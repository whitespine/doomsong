<script>
    import roll_types from "./roll_types.json";
    import { targeted_tokens } from "../../utils/target.svelte";
    import { rollCheck } from "../../utils/roll";
    import { initiateAttack } from "../../apps/dodge_prompt.svelte";

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
        return {
            Traits: 0,
            Gear: 0,
            Conditions: 0,
            Allies: 0,
            Extra: 0,
        };
    }

    // Callback for setting a roll type
    function selectRollType(evt) {
        roll_type_key = evt.target.value;
        difficulty = roll_type.default_difficulty;
    }

    // Our currently selected options
    let roll_type_key = $state("standard");
    let roll_type = $derived(
        roll_types[roll_type_key] || roll_types["standard"],
    );
    let choices = $state(defaultChoices());
    // let difficulty = $state(5);
    let difficulty = $derived.by(() => {
        if (targeted_tokens.length == 1) {
            // Use their toughness + protection instead
            return targeted_tokens[0].actor.system.attack_difficulty;
        }
        return 5;
    });

    // Reset the above two to their default values
    function reset() {
        choices = defaultChoices();
        difficulty = 5;
    }

    // Button callback
    function changeChoice(category, value) {
        choices[category] = value;
    }

    // Roll handler
    async function roll(mode) {
        let total_bonuses = Object.values(choices).reduce((x, y) => x + y, 0);
        let attacker = _token?.actor ?? game.user.character;
        if (
            (roll_type_key == "attack") &&
            (targeted_tokens.length != 0) &&
            attacker
        ) {
            initiateAttack({
                user: game.user.id,
                attacker,
                targets: targeted_tokens.map(t => t.actor),
                bonus: total_bonuses,
            });
        } else {
            // Handle immediately
            rollCheck({  roll_type: roll_type_key, difficulty, mode, bonus: total_bonuses });
        }
        // reset();
    }
</script>

<div class="doomsong container">
    <div class="header">
        <select class="elevated" onchange={selectRollType}>
            {#each Object.entries(roll_types) as [key, type]}
                <option value={key}>{type.label}</option>
            {/each}
        </select>
        <span class="elevated difficulty">Difficulty:</span>
        <button onclick={() => difficulty--}>-</button>
        <span class="difficulty value" data-tooltip="Difficulty"
            >{difficulty}</span
        >
        <button class="invert" onclick={() => difficulty++}>+</button>
    </div>
    <div class="roll-options">
        {#each ["Traits", "Gear", "Conditions", "Allies"] as category}
            <div>
                <span>{category}:</span>
            </div>
            {#each [-1, 0, 1, 2, 3] as value}
                {#if value <= 2 || category == "Traits"}
                    <button
                        onclick={() => changeChoice(category, value)}
                        data-tooltip={valueTooltip(value)}
                        class={{ active: choices[category] == value }}
                    >
                        {value > 0 ? "+" : ""}{value}
                    </button>
                {:else}
                    <!-- Pardon my ugly svelte -->
                    {#if category == "Gear"}
                        <div class="extra top">
                            <button
                                aria-label="Increase extra bonus"
                                onclick={() =>
                                    changeChoice("Extra", choices.Extra + 1)}
                            >
                                <i class="fas fa-caret-up"></i>
                            </button>
                        </div>
                    {:else if category == "Conditions"}
                        <div class="extra mid" data-tooltip="Other bonuses">
                            <span>
                                Bonus: {choices.Extra > 0
                                    ? "+"
                                    : ""}{choices.Extra}
                            </span>
                        </div>
                    {:else if category == "Allies"}
                        <div class="extra bottom">
                            <button
                                aria-label="Decrease extra bonus"
                                onclick={() =>
                                    changeChoice("Extra", choices.Extra - 1)}
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
            >{roll_type_key == "attack" ? "Light" : "Hasty"}</button
        >
        <button onclick={() => roll("standard")}>Standard</button>
        <button onclick={() => roll("focused")}
            >{roll_type_key == "attack" ? "Heavy" : "Focused"}</button
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

        // Our difficulty buttons
        button {
            width: 30px;
            font-size: x-large;
            border-radius: 0px;
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
