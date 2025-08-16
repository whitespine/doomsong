<script>
    import { onMount, onDestroy } from "svelte";
    import SetPhase from "./SetPhase.svelte";
    import ActsPhase from "./ActsPhase.svelte";

    let props = $props();

    // A clunky bit of state, stands for current combat. Needed to get past svelte "optimization" until theres a proper invalidate rune
    let cc = $state.raw({
        val: game.combat,
    });

    // Make a hook on mount to track any changes to combatants. TODO - fix updateCombat to not potentially thrash?
    let combat_hooks = [];
    onMount(() => {
        combat_hooks.push(
            Hooks.on("updateCombat", (combat, delta, _meta) => {
                cc = {
                    val: combat,
                };
            }),
        );
        for (let type of ["update", "create", "delete"]) {
            combat_hooks.push(
                Hooks.on(`${type}Combatant`, () => {
                    cc = {
                        ...cc,
                    };
                }),
            );
        }
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

    $inspect(cc);
    // {[...current_combat.combat.combatants.keys()]}
</script>

<div class="combat-tracker">
    {#if cc == null}
        <span>No current combat. TODO: Add a button here to add one</span>
    {:else}
        <span>{[...cc.val.combatants.keys()]}</span>
        <div class="phase">
            {#if cc.val.system.phase == "begin"}
                <span>begin</span>
            {:else if cc.val.system.phase == "set"}
                <SetPhase />
            {:else if cc.val.system.phase == "acts"}
                <ActsPhase />
            {:else if cc.val.system.phase == "retreat"}
                <span>Retreat</span>
            {:else if cc.val.system.phase == "end"}
                <span>End</span>
            {/if}
        </div>
        <nav class="phase-controls">
            <!-- Buttons to control combat -->
            <button onclick={() => cc.val.prevPhase()}>Previous</button>
            <button onclick={() => cc.val.nextPhase()}>Next</button>
        </nav>
    {/if}
</div>

<style lang="scss">
    .combat-control,
    .combatant-control {
        cursor: pointer;
    }

    .combat-tracker {
        display: flex;
        flex-direction: column;
    }

    .phase {
        flex: 1 0 auto;
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

    img {
        max-width: 64px;
        max-height: 64px;
    }
</style>
