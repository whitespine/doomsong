<script>
    import Die from "../rolls/Dice.svelte";
    let { combatant } = $props();

    let thumbnail = $derived.by(() => {
        //if ( combatant._videoSrc && !combatant.img ) {
        //if ( combatant._thumb ) return combatant._thumb;
        //return combatant._thumb = await game.video.createThumbnail(combatant._videoSrc, {width: 100, height: 100});
        //}
        return combatant.img ?? CONST.DEFAULT_TOKEN;
    });

    let add_die_cursor = $derived.by(() => {
        let owns = true; // TODO implement
        let can_set = combatant.canSetDie() ? "pointer" : "default";
        return owns && can_set;
    });
</script>

<div class="planner">
    <img
        class="thumbnail"
        src={thumbnail}
        alt={combatant.name}
        data-tooltip={combatant.name}
    />
    <h2>{combatant.name}</h2>
    <div class="dice-box">
        {#each [1, 2, 3, 4, 5, 6] as act}
            <Die
                style={`cursor: ${add_die_cursor}`}
                value={act}
                onclick={() => combatant.setDice(act)}
                data-tooltip={combatant.actor.actTooltip(act)}
            />
        {/each}
    </div>
    <div class="plan-box">
        {#each combatant.system.set_dice as act}
            <Die
                value={act}
                style="cursor: pointer"
                onclick={() => combatant.unsetDie(act)}
                data-tooltip={combatant.actor.actTooltip(act)}
            />
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
