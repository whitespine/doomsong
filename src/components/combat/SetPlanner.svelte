<script>
    import Die from "../rolls/Die.svelte";
    import RollingDie from "../rolls/RollingDie.svelte";
    let { combat, combatant } = $props();
    import { DOOMSONG } from "../../consts";

    let owner = $derived(combatant.owner);
    let visible_dice = $derived(combatant.visible_dice);
    let set_cursor = $derived((owner && combatant.canSetDie()) ? "pointer" : "default");
    let clear_cursor = $derived(owner ? "pointer" : "default");
</script>

<div class="planner">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <img
        class="thumbnail"
        src={combatant.thumbnail}
        alt={combatant.name}
        onclick={() => combatant.ping()}
        oncontextmenu={() => combatant.delete()}
    />
    <h2>{combatant.name}</h2>
    <div class="dice-box">
        {#each [1, 2, 3, 4, 5, 6] as act}
            <Die
                style={`cursor: ${set_cursor}`}
                value={act}
                onclick={() => combatant.setDice(act)}
                data-tooltip={ combatant.actTooltip(act) }
                data-tooltip-class="doomsong actions"
            />
        {/each}
    </div>
    <div class="plan-box">
        {#each { length: combatant.system.available_dice }, set_index}
            {#if visible_dice[set_index]}
                <Die
                    value={visible_dice[set_index]}
                    style={`cursor: ${clear_cursor}`}
                    onclick={() => combatant.unsetDie(visible_dice[set_index])}
                    oncontextmenu={() => combatant.unsetDie(visible_dice[set_index])}
                    data-tooltip={ combatant.actTooltip(visible_dice[set_index]) }
                    data-tooltip-class="doomsong actions"
                />
            {:else}
                <RollingDie
                    discarded={true}
                    data-tooltip="Intentions Unknown"
                    data-tooltip-class="doomsong actions"
                />
            {/if}
        {/each}
    </div>
</div>

<style lang="scss">
    .planner {
        display: grid;
        grid-template:
            "t h p" 20px
            "t d p" 1fr / 64px 1fr 64px;
        border-bottom: 1px solid black;

        .thumbnail {
            max-width: 64px;
            max-height: 64px;
            // background-color: black;
            grid-area: t;
            cursor: pointer;
        }

        .dice-box {
            display: grid;
            grid-template: 1fr / repeat(6, 1fr);
            justify-content: center;
            align-items: center;
            grid-area: d;
        }

        h2 {
            grid-area: h;
            border-bottom: none;
            font-size: x-large;
        }

        .plan-box {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            grid-area: p;
            border-left: 1px solid black;
        }
    }
</style>
