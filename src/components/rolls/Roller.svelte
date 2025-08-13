<div class="doomsong container">
    <h1>Check</h1>
    <div class="roll-options">
        {#each ["Traits", "Gear", "Conditions", "Allies"] as category}
            <span>{category}</span>
            {#each [-1, 0, 1, 2, 3] as value}
                {#if value <= 2 || category == "Traits"}
                    <button 
                        onclick={() => changeChoice(category, value)} 
                        data-tooltip={valueTooltip(value)} 
                        class={{ active: choices[category] == value}}>
                        {value}
                    </button> 
                {:else}
                    <div></div>
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

<script>
    // Gives tooltips for a given value
    function valueTooltip(value) {
        return {
            "-1": "Hindering",
            "0": "Irrelevant",
            "1": "Helpful",
            "2": "Perfect",
            "3": "Perfect and Defining"
        }[value];
    }

    // Our default choices
    function defaultChoices() {
        return {
            "Traits": 0, 
            "Gear": 0, 
            "Conditions": 0, 
            "Allies": 0
        }
    }

    // Our currently selected options
    let choices = $state(defaultChoices());

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
            focused: `2d6kh1 + ${total_bonuses}`
        }[mode];
        let roll = await new Roll(formula).roll();
        ui.notifications.info(roll.total);
        ChatMessage.create({
            rolls: [roll],
            // Doomsong specific sauce
            [`flags.${game.system.id}`]: {
                type: "roll",
                flipped: false,
                category: "standard"
            }
        })
    }
</script>

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