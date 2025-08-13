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

    // Our currently selected options
    let choices = $state({
        "Traits": 0, 
        "Gear": 0, 
        "Conditions": 0, 
        "Allies": 0
    });

    // Button callback
    function changeChoice(category, value) {
        choices[category] = value;
    }
    $inspect(choices);
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
</style>