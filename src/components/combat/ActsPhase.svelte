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
                <div class="thumbnail">
                    <img
                        src={thumbnail(c.combatant)}
                        alt={c.combatant.name}
                    />
                </div>
                <div class="header">
                    <h2>{c.combatant.name}</h2>
                    <h3>Move a short distance and perform {c.actions} action{c.actions > 1 ? "s" : ""}</h3>
                </div>
                <ul class="actions">
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
        display: grid;
        grid-template:
            "portrait header" 76px
            "actions actions" 1fr / 76px 1fr;

        h2,h3 {
            margin-bottom: 3px;
            border-bottom: none;
        }

        .thumbnail {
            img {
                max-width: 76px;
                max-height: 74px;
            }
            grid-area: portrait;
            border-bottom: 1px solid black;
            border-top: 1px solid black;
        }

        .header {
            grid-area: header;
            border-bottom: 1px solid black;
            border-top: 1px solid black;
        }

        .actions {
            grid-area: actions;
        }
    }
</style>
