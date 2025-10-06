<script>
    import {stop} from "../../utils/handlers";
    import PlayerBio from "./PlayerBio.svelte";
    let { app, context } = $props();
    const TABS = {
        bio: "Biography",
        abilities: "Abilities",
        gear: "Gear",
        combat: "Combat",
        notes: "Notes",
    };
    let tab = $state("bio");

    function swapTab(e, tab_id) {
        stop(e);
        tab = tab_id;
    }
</script>

<form class="root">
    <button hidden disabled>Snake Eater</button>
    <div class="tabs">
        {#each Object.entries(TABS) as [tab_id, tab_label] }
            <button class={{invert: tab_id == tab}} onclick={(e) => swapTab(e, tab_id)}>{tab_label}</button>
        {/each}
    </div>

    <div class="body">
        {#if tab == "bio"} 
            <PlayerBio {app} {context} />
        {/if}

    </div>
</form>

<style lang="scss">
    .tabs {
        display: flex;
        flex-direction: row;
        border-bottom: solid black 1px;;
        padding-left: 20px;

        button {
            height: 3em;
        }
    }
</style>
