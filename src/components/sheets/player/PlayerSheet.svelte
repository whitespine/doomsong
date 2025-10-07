<script>
    import { stop } from "../../../utils/handlers";
    import PlayerAbilities from "./PlayerAbilities.svelte";
    import PlayerBio from "./PlayerBio.svelte";
    import PlayerCombat from "./PlayerCombat.svelte";
    import PlayerGear from "./PlayerGear.svelte";
    import PlayerNotes from "./PlayerNotes.svelte";
    let { app, context } = $props();
    const TABS = {
        bio: "Biography",
        abilities: "Abilities",
        gear: "Gear",
        combat: "Combat",
        notes: "Notes",
        conditions: "Conditions",
    };
    let tab = $state("bio");
    let edit = $state(true);

    function swapTab(e, tab_id) {
        stop(e);
        tab = tab_id;
    }
</script>

<form class="root" onsubmit={stop}>
    <button hidden disabled>Snake Eater</button>
    <div class="tabs">
        {#each Object.entries(TABS) as [tab_id, tab_label]}
            <button
                class={{ invert: tab_id == tab }}
                onclick={(e) => swapTab(e, tab_id)}>{tab_label}</button
            >
        {/each}
        <button
            hidden={![].includes(tab)}
            aria-label="Toggle Edit"
            onclick={(e) => (stop(e), (edit = !edit))}
            class={{ invert: edit }}
        >
            <i class="fas fa-edit"></i>
        </button>
    </div>

    <div class="body">
        {#if tab == "bio"}
            <PlayerBio {app} {context} />
        {:else if tab == "abilities"}
            <PlayerAbilities {app} {context} />
        {:else if tab == "gear"}
            <PlayerGear {app} {context} />
        {:else if tab == "combat"}
            <PlayerCombat {app} {context} />
        {:else if tab == "notes"}
            <PlayerNotes {app} {context} />
        {:else if tab == "conditions"}
            <PlayerNotes {app} {context} />
        {/if}
    </div>
</form>

<style lang="scss">
    .tabs {
        display: flex;
        flex-direction: row;
        border-bottom: solid black 1px;
        padding-left: 20px;

        button {
            height: 3em;
        }
    }
</style>
