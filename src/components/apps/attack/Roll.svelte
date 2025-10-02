<script>
    import RollingDie from "../../rolls/RollingDie.svelte";
    import { broadcastFlow, FLOW_STEPS } from "../../../apps/dodge_prompt.svelte";
    import { onMount, onDestroy } from "svelte";

    /** @import { AttackFlowApp } from "../../../apps/dodge_prompt.svelte" */

    /**
     * @type {{app: AttackFlowApp, attacker: Actor, defender: Actor}}
     */
    let { app, attacker, defender } = $props();

    let dice_count = $derived(app.flow.attack.formula.includes("2d6") ? 2 : 1); // For display purposes only

    async function doRoll() {
        // Handle the actual dice roll
        let roll = await new Roll(app.flow.attack.formula).roll();

        // Send to chat immediately
        let message = await ChatMessage.create({
            rolls: [roll],
            speaker: attacker,
            // Doomsong specific sauce
            [`flags.${game.system.id}`]: {
                type: "roll",
                roll_type: "attack",
                coin_result: 0,
                difficulty: defender.system.attack_difficulty + app.flow.footing_spent + app.flow.bonus_dodge,
            },
        });
    }

    onMount(() => {
        if(game.user.id == app.flow.attack.user) {
            doRoll();

            // Until we have proper dsn support, just use a timeout
            setTimeout(() => {
                // We basically just want to move this forward after 2 seconds
                app.flow.step = FLOW_STEPS.RESOLVE;
                broadcastFlow(app.flow);
            // }, 2000);
            }, 2000);
        }
    });

    /*
    onDestroy(() => {
        if (interval) {
            clearInterval(interval);
        }
    });
    */
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
