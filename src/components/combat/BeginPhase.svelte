<script>
    import { zip } from "../../utils/zip";
    let { combat, source } = $props();
</script>

<div class="flexcol">
    <span>{@html game.i18n.localize("DS.combat.phase_detail.begin")}</span>
    {#each zip(combat.combatants.contents, source.combatants) as [combatant, cdata]}
        <div
            class="combatant"
            onclick={() => combatant.actor.sheet.render(true)}
            oncontextmenu={() => combatant.delete()}
        >
            <img class="thumbnail" src={combatant.thumbnail} alt={cdata.name} />
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
