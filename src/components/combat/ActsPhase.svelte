<script>
    let { cc } = $props();
    let act = $derived(cc.system.act);

    // An array containing [{combatant: combatant, actions: actions}] they can do in this act}
    let combatant_actions = $derived(cc.combatantsByAct[act]);

    // Get a thumbnail for a combatant
    function thumbnail(combatant) {
        //if ( combatant._videoSrc && !combatant.img ) {
        //if ( combatant._thumb ) return combatant._thumb;
        //return combatant._thumb = await game.video.createThumbnail(combatant._videoSrc, {width: 100, height: 100});
        //}
        return combatant.img ?? CONST.DEFAULT_TOKEN;
    }

    const canSeeMoves = (combatant) =>
        combatant.permission >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER;
    const canSee = (combatant) =>
        combatant.permission >= CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED;
</script>

<div class="combatants">
    {#each combatant_actions as c}
        {#if canSee(c.combatant)}
            <div class="combatant">
                <img
                    class="thumbnail"
                    src={thumbnail(c.combatant)}
                    alt={c.combatant.name}
                    data-tooltip={c.combatant.name}
                />
                <div class="flexcol detail">
                    <h2>{c.combatant.name} - Choose {c.actions}</h2>
                    <ul>
                        {#if !canSeeMoves(c.combatant)}
                            <li>This combatant's capabilities are a mystery</li>
                        {:else if !c.combatant.hasMovesDefined}
                            <li>Consult book</li>
                        {:else if c.combatant.actor.system.moves[act - 1].length > 0}
                            {#each c.combatant.actor.system.moves[act - 1] as move}
                                <li>{move}</li>
                            {/each}
                        {:else}
                            <li>No actions possible</li>
                        {/if}
                    </ul>
                </div>
            </div>
        {/if}
    {/each}
</div>

<style lang="scss">
    .combatants {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .combatant {
        display: flex;
        flex-direction: row;

        h2 {
            margin-bottom: 3px;
        }

        .detail {
            flex-grow: 1;
        }
    }

    .thumbnail {
        max-width: 64px;
        max-height: 64px;
        // background-color: black;
    }
</style>
