<script>
    import RollingDie from "../../rolls/RollingDie.svelte";
    import { broadcastFlow, FLOW_STEPS } from "../../../apps/dodge_prompt.svelte";

    /** @import { AttackFlowApp } from "../../../apps/dodge_prompt.svelte" */

    /**
     * @type {{app: AttackFlowApp, attacker: Actor, defender: Actor}}
     */
    let { app, attacker, defender } = $props();

    let dice_count = $derived(app.includes("2d6") ? 2 : 1); // For display purposes only

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
        if(game.user.id == app.flow.attack.attacker) {
            doRoll();

            // Until we have proper dsn support, just use a timeout
            setTimeout(() => {
                // We basically just want to move this forward after 2 seconds
                app.flow.step = FLOW_STEPS.RESOLVE;
                broadcastFlow(app.flow);
            }, 1000);
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
    <h1>Oooooooo</h1>
    <div class="flexrow">
        {#each { length: dice_count } as _, i}
            <RollingDie />
        {/each}
    </div>
</div>

<style lang="scss">
    div {
        display: grid;
        grid-template: 1fr / 1fr 1fr;
        align-items: center;
        justify-content: center;
        align-content: center;

        div {
            display: flex;
            flex-direction: row;
            img {
                flex-grow: 1;
                max-width: 33%;
                max-height: auto;
                // margin: auto;
            }
        }

        p {
            text-align: center;
            font-size: large;
            font-weight: 300;
        }
        label {
            text-align: right;
            padding-right: 20px;
        }

        button.devote {
            min-height: 60px;
            font-size: xx-large;
        }

        .wide {
            grid-column: 1 / 3;
        }
    }
</style>
