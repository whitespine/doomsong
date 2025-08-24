<script>
    import Die from "../rolls/Die.svelte";
    import RollingDie from "../rolls/RollingDie.svelte";
    let { combatant } = $props();

    let thumbnail = $derived.by(() => {
        //if ( combatant._videoSrc && !combatant.img ) {
        //if ( combatant._thumb ) return combatant._thumb;
        //return combatant._thumb = await game.video.createThumbnail(combatant._videoSrc, {width: 100, height: 100});
        //}
        return combatant.img ?? CONST.DEFAULT_TOKEN;
    });
    let can_see_moves = $derived(
        combatant.permission >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER,
    );
    let can_edit = $derived(
        combatant.permission >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
    );

    let add_die_cursor = $derived.by(() => {
        let owns = can_edit; 
        let can_set = combatant.canSetDie() ? "pointer" : "default";
        return owns && can_set;
    });
</script>

<div class="planner">
    <img
        class="thumbnail"
        src={thumbnail}
        alt={combatant.name}
        onclick={() => combatant.actor.sheet.render(true)}
        oncontextmenu={() => combatant.delete()}
    />
    <h2>{combatant.name}</h2>
    <div class="dice-box">
        {#each [1, 2, 3, 4, 5, 6] as act}
            <Die
                style={`cursor: ${add_die_cursor}`}
                value={act}
                onclick={() => combatant.setDice(act)}
                data-tooltip={ can_see_moves ? combatant.actor.actTooltip(act) : "This creature's capabilities are a mystery"}
                data-tooltip-class="doomsong actions"
            />
        {/each}
    </div>
    <div class="plan-box">
        {#each { length: combatant.system.available_dice }, set_index}
            {#if can_see_moves && combatant.system.set_dice[set_index]}
                <Die
                    value={combatant.system.set_dice[set_index]}
                    style="cursor: pointer"
                    onclick={() => combatant.unsetDie(combatant.system.set_dice[set_index])}
                    oncontextmenu={() => combatant.unsetDie(combatant.system.set_dice[set_index])}
                    data-tooltip={ combatant.actor.actTooltip(combatant.system.set_dice[set_index]) }
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
