<script>
    import SetPhase from "./SetPhase.svelte";
    import ActsPhase from "./ActsPhase.svelte";
    import Die from "../rolls/Die.svelte";
    import BeginPhase from "./BeginPhase.svelte";

    // A clunky bit of state, stands for current combat. Needed to get past svelte "optimization" until theres a proper invalidate rune
    let { context } = $props();
    let combat = $derived(context.combat);
    let source = $derived(context.source);
</script>

<div class="combat-tracker">
    {#if combat == null}
        <span>No current combat. Toggle combat on tokens to create one.</span>
    {:else}
        <h1>
            <span>{game.i18n.localize(`DS.combat.phase.${source.system.phase}`)}</span>
            {#if source.system.phase == "acts"}
                <Die value={source.system.act} />
            {/if}
        </h1>
        <div class="content">
            <div class="phase">
                {#if source.system.phase == "begin"}
                    <BeginPhase {combat} {source} />
                {:else if source.system.phase == "set"}
                    <SetPhase {combat} {source} />
                {:else if source.system.phase == "acts"}
                    <ActsPhase {combat} {source} />
                {:else if source.system.phase == "retreat"}
                    {@html game.i18n.localize("DS.combat.phase_detail.retreat")}
                {:else if source.system.phase == "end"}
                    {@html game.i18n.localize("DS.combat.phase_detail.end")}
                {/if}
            </div>
        </div>
        <nav class="phase-controls">
            <button onclick={() => combat.prevPhase()}>Previous</button>
            <button onclick={() => combat.nextPhase()}>Next</button>
        </nav>
    {/if}
</div>

<style lang="scss">
    .combat-tracker {
        display: flex;
        flex-direction: column;
        background-color: white;
        color: black;
        height: 100%;
        overflow: hidden auto;
        padding: 5px;
    }

    .phase {
        height: 1px; // Trust me bro
        width: 100%;
    }

    h1 {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .content {
        flex: 1;
        display: flex;
        overflow: hidden auto;
    }

    .phase-controls {
        display: flex;
        flex-direction: row;
        width: 100%;
        align-self: end;
        > * {
            flex-grow: 1;
        }
    }
</style>
