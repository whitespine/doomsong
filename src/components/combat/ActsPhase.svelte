<script>
    let { combat, source } = $props();
    let act = $derived(source.system.act);

    // An array containing [{combatant: combatant, actions: actions}] they can do in this act}
    let combatant_actions = $derived(combat.combatantsByAct[act]);

    const canSeeMoves = (combatant) =>
        combatant.permission >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER;
    const canSee = (combatant) =>
        combatant.permission >= CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED;
</script>

<div class="combatants">
    {#each combatant_actions as c}
        {#if canSee(c.combatant)}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <div class="combatant" onclick={() => c.combatant.ping()} role="presentation" >
                <div class="thumbnail">
                    <img
                        src={c.combatant.thumbnail}
                        alt={c.combatant.name}
                    />
                </div>
                <div class="header">
                    <h2 class="clip-text">{c.combatant.name}</h2>
                    <h4>Move a short distance and perform {c.actions} action{c.actions > 1 ? "s" : ""}</h4>
                </div>
                <ul class="actions">
                    {#if !canSeeMoves(c.combatant)}
                        <li>This combatant's capabilities are a mystery</li>
                    {:else if !c.combatant.hasMovesDefined}
                        <li>Consult book</li>
                    {:else if Object.keys(c.combatant.actor.system.moves[act]).length > 0}
                        {#each Object.values(c.combatant.actor.system.moves[act]) as move}
                            <li>{move.name}: {move.text}</li>
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

        h2 {
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
