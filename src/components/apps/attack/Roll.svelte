<script>
    import RollingDie from "../../rolls/RollingDie.svelte";

    /** @import { AttackFlowApp } from "../../../apps/dodge_prompt.svelte" */

    /**
     * @type {{app: AttackFlowApp, attacker: Actor, defender: Actor}}
     */
    let { app, attacker, defender } = $props();

    let dice_count = $derived(app.flow.attack.formula.includes("2d6") ? 2 : 1); // For display purposes only
</script>

<div>
    <div class="dicebox">
        {#each { length: dice_count } as _, i}
            <RollingDie class="bigdice" />
        {/each}
    </div>
</div>

<style lang="scss" module>
    .dicebox {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        img {
            --size: 64px;
            width: var(--size);
            height: var(--size);
            margin: 12px;
        }
    }
</style>
