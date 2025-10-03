<script>
    import { zip } from "../../utils/zip";
    let { combat } = $props();
</script>

<div class="flexcol">
    <span>{@html game.i18n.localize("DS.combat.phase_detail.begin")}</span>
    {#each combat.combatants.values() as combatant}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="combatant"
            onclick={() => combatant.ping()}
            oncontextmenu={() => combatant.delete()}
        >
            <img class="thumbnail" src={combatant.thumbnail} alt={combatant.name} />
            <span class="elevated">{combatant.name}</span>
        </div>
    {/each}
</div>

<style lang="scss">
    .combatant {
        display: flex;
        flex-direction: row;
        align-items: center;

        .thumbnail {
            width: 64px;
            height: 64px;
        }

        span {
            color: black;
            font-size: x-large;
        }
    }
</style>
