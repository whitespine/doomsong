<script>
    import attack_img from "$assets/icons/attack.png";
    import Incrementer from "../../fields/Incrementer.svelte";
    import { AttackFlow } from "../../../apps/dodge_prompt.svelte";

    /**
     * @type {{flow: AttackFlow, attacker: Actor, defender: Actor}}
     */
    let { flow, attacker, defender } = $props();
</script>

<form onsubmit={submit}>
    <div class="wide">
        <img src={attacker.img} alt={`Portrait of ${attacker.name}`} />
        <img src={attack_img} alt="An axe striking a shield" />
        <img src={defender.img} alt={`Portrait of ${defender.name}`} />
    </div>
    <p class="wide">Spend footing to dodge or block</p>

    <label for="footing_spent">Footing Spent:</label>
    <Incrementer
        type="number"
        name="footing_spent"
        min="0"
        max={defender.system.footing}
        bind:value={flow.footing_spent}
    />

    <label for="bonus_dodge" data-tooltip="For instance, a shield gives +1 dodge if footing is spent to block">Bonus Dodge:</label>
    <Incrementer type="number" name="bonus_dodge" min="0" bind:value={flow.bonus_dodge} />

    <button class="devote wide elevated">Commit</button>
</form>

<style lang="scss">
    form {
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
