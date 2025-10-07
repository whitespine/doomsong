<script>
    import { stop } from "../../../utils/handlers";
    import PlayerAbilitiesEdit from "./PlayerAbilitiesEdit.svelte";
    import PlayerAbilitiesView from "./PlayerAbilitiesView.svelte";
    import PlayerBioEdit from "./PlayerBioEdit.svelte";
    let { app, context } = $props();
    const TABS = {
        bio: "Biography",
        abilities: "Abilities",
        gear: "Gear",
        combat: "Combat",
        notes: "Notes",
    };
    let tab = $state("bio");
    let edit = $state(true);

    function swapTab(e, tab_id) {
        stop(e);
        tab = tab_id;
    }
</script>

<form class="root">
    <button hidden disabled>Snake Eater</button>
    <div class="tabs">
        {#each Object.entries(TABS) as [tab_id, tab_label]}
            <button
                class={{ invert: tab_id == tab }}
                onclick={(e) => swapTab(e, tab_id)}>{tab_label}</button
            >
        {/each}
        <button
            aria-label="Toggle Edit"
            onclick={(e) => (stop(e), (edit = !edit))}
            class={{ invert: edit }}
        >
            <i class="fas fa-edit"></i>
        </button>
    </div>

    <div class="body">
        {#if tab == "bio"}
            {#if edit}
                <PlayerBioEdit {app} {context} />
            {:else}
                <!-- TODO: Display -->
                <span>TODO: More visually appealing player bio</span>
            {/if}
        {:else if tab == "abilities"}
            {#if edit}
                <PlayerAbilitiesEdit {app} {context} />
            {:else}
                <PlayerAbilitiesView {app} {context} />
            {/if}
        {:else if tab == "gear"}
            <span>Gear up</span>
        {:else if tab == "combat"}
            <span>Combat edit tbd!</span>
        {:else if tab == "notes"}
            <span>Notes edit tbd!</span>
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
