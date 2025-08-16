<script>
    import Die from "../rolls/Dice.svelte";
    let { act, cc } = $props();
    
    // An array containing [{combatant: combatant, actions: actions}] they can do in this act}
    let combatant_actions = $derived.by(() => {
        let result = [];
        for(let combatant of cc.combatants) {
            // Get number of dice they have for this act
            let for_this_act = combatant.system.set_dice.filter(v => v == act).length;
            if (for_this_act > 0) {
                result.push({
                    combatant, 
                    actions: for_this_act
                });
            }
        }
        return result;
    });

    // Get a thumbnail for a combatant
    function thumbnail(combatant) {
        //if ( combatant._videoSrc && !combatant.img ) {
        //if ( combatant._thumb ) return combatant._thumb;
        //return combatant._thumb = await game.video.createThumbnail(combatant._videoSrc, {width: 100, height: 100});
        //}
        console.log(combatant);
        return combatant.img ?? CONST.DEFAULT_TOKEN;
    }
</script>

<div class="container">
    <Die value={act} />
    <div class="combatant">
        {#each combatant_actions as c}
            <img class="thumbnail" src={thumbnail(c.combatant)} alt={c.combatant.name} data-tooltip={c.combatant.name} />

        {/each}
    </div>
</div>

<style lang="scss">
    .container {
        display: grid;
        grid-template: 1fr / 60px 1fr;
        justify-content: center;
        align-items: center;
    }

    .combatant {
        display: flex;
        flex-direction: row;
    }

    .thumbnail {
        max-width: 64px;
        max-height: 64px;
        background-color: black;
    }
</style>
