<script>
    import attack_img from "$assets/icons/attack.png";
    import Incrementer from "../../fields/Incrementer.svelte";
    import { DOOMSONG } from "../../../consts";
    import {
        broadcastFlow,
        FLOW_STEPS,
    } from "../../../apps/dodge_prompt.svelte";

    /** @import { AttackFlowApp } from "../../../apps/dodge_prompt.svelte" */

    /**
     * @type {{app: AttackFlowApp, attacker: Actor, defender: Actor}}
     */
    let { app, attacker, defender } = $props();

    function submit(e) {
        app.flow.step = FLOW_STEPS.ROLL; // We move on to the roll
        broadcastFlow(app.flow);
    }
</script>

<form onsubmit={submit}>
    <div>
        <h1 class="clip-text">{attacker.name}</h1>
        <h1>vs</h1>
        <h1 class="clip-text">{defender.name}</h1>
        <img src={attacker.img} alt={`Portrait of ${attacker.name}`} />
        <img src={attack_img} alt="An axe striking a shield" />
        <img src={defender.img} alt={`Portrait of ${defender.name}`} />
    </div>
    <p>Spend footing to dodge or block</p>

    <div class="inputs">
        <label for="footing_spent">Footing Spent:</label>
        <Incrementer
            name="footing_spent"
            min="0"
            max={defender.system.footing}
            bind:value={app.flow.footing_spent}
            style={"margin-left: auto"}
            width="140px"
        />
    </div>

    <div class="inputs">
        <label
            for="bonus_dodge"
            data-tooltip="For instance, a shield gives +1 dodge if footing is spent to block"
            >Bonus Dodge:</label
        >
        <Incrementer
            name="bonus_dodge"
            min="0"
            bind:value={app.flow.bonus_dodge}
            style={"margin-left: auto"}
            width="140px"
        />
    </div>

    <button class="devote wide elevated">Commit</button>
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        align-items: center;

        div {
            display: grid;
            grid-template: 32px 1fr / repeat(3, 1fr);
            align-items: center;
            justify-items: center;
        }

        p {
            text-align: center;
            font-size: large;
            font-weight: 300;
        }

        .inputs {
            width: 100%;
            height: 3em;
            display: flex;
            flex-direction: row;

            label {
                font-weight: 300;
            }
        }

        button.devote {
            min-height: 60px;
            font-size: xx-large;
            width: 100%;
        }
    }
</style>
