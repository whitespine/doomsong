<script>
    import roll_types from "./roll_types.json";
    import { targeted_tokens } from "../../utils/target.svelte";

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
    let roll_type_key = $state("STANDARD");
    let roll_type = $derived(
        roll_types[roll_type_key] || roll_types["STANDARD"],
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
        let formula = {
            hasty: `2d6kl1 + ${total_bonuses}`,
            standard: `1d6 + ${total_bonuses}`,
            focused: `2d6kh1 + ${total_bonuses}`,
        }[mode];
        let roll = await new Roll(formula).roll();

        // Send to chat
        await ChatMessage.create({
            rolls: [roll],
            speaker: ChatMessage.getSpeaker(),
            // Doomsong specific sauce
            [`flags.${game.system.id}`]: {
                type: "roll",
                roll_type: roll_type_key,
                coin_result: 0,
                difficulty: difficulty,
                category: "standard",
            },
        });
        reset();
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
        <button class="add" onclick={() => difficulty++}>+</button>
        <span class="difficulty value" data-tooltip="Difficulty"
            >{difficulty}</span
        >
        <button class="subtract" onclick={() => difficulty--}>-</button>
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
        <button onclick={() => roll("hasty")}>Hasty</button>
        <button onclick={() => roll("standard")}>Standard</button>
        <button onclick={() => roll("focused")}>Focused</button>
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

            &.add {
                color: white;
                background-color: black;
            }

            &.subtract {
                background-color: white;
                color: black;
            }
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

    /*
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

        // Buttons we want to be flush, like in the book
        button {
            cursor: pointer;
            font-size: large;
            font-weight: normal;
            box-shadow: none;


            outline: none;
            border-radius: 0px;
            border: none;
            padding: 0;
            background: none;
            &.active {
                box-shadow: inset 0 0 0 2px black;
                font-weight: bolder;
            }
        }

        // Alternate rows
        > *:nth-child(12n+1),
        > *:nth-child(12n+2),
        > *:nth-child(12n+3),
        > *:nth-child(12n+4),
        > *:nth-child(12n+5),
        > *:nth-child(12n+6) {
            background: grey;
        }
    }

    .roll-buttons {
        display: flex;
        flex-direction: row;
    }
        */
</style>
