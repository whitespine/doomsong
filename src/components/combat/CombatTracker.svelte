<script>
    import { onMount, onDestroy } from "svelte";
    import SetPhase from "./SetPhase.svelte";
    import ActsPhase from "./ActsPhase.svelte";
    import { mimic } from "../../utils/mimic";

    // A clunky bit of state, stands for current combat. Needed to get past svelte "optimization" until theres a proper invalidate rune
    let cc = $state.raw(mimic(game.combat));

    $inspect(cc);

    // Make a hook on mount to track any changes to combatants. TODO - fix updateCombat to not potentially thrash?
    let combat_hooks = [];

    // Force a re-render
    function tick() {
        cc = mimic(game.combat);
    }
    onMount(() => {
        combat_hooks.push(
            Hooks.on("updateCombat", tick),
            Hooks.on("updateCombatant", tick),
            Hooks.on("createCombatant", tick),
            Hooks.on("deleteCombatant", tick),
        );
    });

    // Cleanup hook on destroy
    onDestroy(() => {
        for (let hook of combat_hooks) {
            try {
                Hooks.off(hook);
            } catch (e) {
                console.warn(e);
            } // Don't care
        }
    });
</script>

<div class="combat-tracker">
    {#if cc == null}
        <span>No current combat. TODO: Add a button here to add one</span>
    {:else}
        <h1>{game.i18n.localize(`DS.combat.phase.${cc.system.phase}`)}</h1>
        <div class="content">
            <div class="phase">
                {#if cc.system.phase == "begin"}{:else if cc.system.phase == "set"}
                    <SetPhase {cc} />
                {:else if cc.system.phase == "acts"}
                    <ActsPhase {cc} />
                {:else if cc.system.phase == "retreat"}{:else if cc.system.phase == "end"}{/if}
            </div>
        </div>
        <nav class="phase-controls">
            <!-- Buttons to control combat -->
            <button onclick={() => cc.prevPhase()}>Previous</button>
            <button onclick={() => cc.nextPhase()}>Next</button>
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
    }

    .phase {
        height: 1px; // Trust me bro
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
