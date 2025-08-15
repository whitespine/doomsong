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
        if(targeted_tokens.length == 1) {
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
        <select onchange={selectRollType}>
            {#each Object.entries(roll_types) as [key, type]}
                <option value={key}>{type.label}</option>
            {/each}
        </select>
        <span class="difficulty">Difficulty:</span>
        <button class="add" onclick={() => difficulty++}>+</button>
        <span class="difficulty value" data-tooltip="Difficulty"
            >{difficulty}</span
        >
        <button class="subtract" onclick={() => difficulty--}>-</button>
    </div>
    <div class="roll-options">
        {#each ["Traits", "Gear", "Conditions", "Allies"] as category}
            <span>{category}</span>
            {#each [-1, 0, 1, 2, 3] as value}
                {#if value <= 2 || category == "Traits"}
                    <button
                        onclick={() => changeChoice(category, value)}
                        data-tooltip={valueTooltip(value)}
                        class={{ active: choices[category] == value }}
                    >
                        {value}
                    </button>
                {:else}
                    <!-- Pardon my ugly svelte -->
                    {#if category == "Gear"}
                        <div></div>
                    {:else if category == "Conditions"}
                        <div></div>
                    {:else if category == "Allies"}
                        <div></div>
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
        background-image: url("ui/parchment.jpg");
        padding: 5px;
        margin-right: 10px;
        display: flex;
        flex-direction: column;
        z-index: calc(var(--z-index-ui) + 10);
        pointer-events: all;
    }

    .header {
        display: flex;
        flex-direction: row;
        align-items: center;

        select {
            flex-grow: 1;
            margin-right: 30px;
            font-size: larger;
        }

        button {
            width: 30px;

            &.add {
                background-color: orange;
            }

            &.subtract {
                background-color: teal;
            }
        }

        .difficulty {
            padding-left: 5px;
            padding-right: 5px;
            font-weight: bolder;
            font-size: x-large;
        }
    }

    select {
        // height: 40px;
        height: 100%;
    }

    .roll-options {
        display: grid;
        grid-template: repeat(4, 1fr) / repeat(6, 1fr);
        align-items: center;
        justify-items: center;

        button {
            cursor: pointer;
            &.active {
                border-width: 2px;
                border-color: black;
            }
        }
    }

    .roll-buttons {
        display: flex;
        flex-direction: row;
    }
</style>
