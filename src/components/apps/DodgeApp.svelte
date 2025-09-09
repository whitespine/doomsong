<script>
    import attack_img from "$assets/icons/attack.png";
    import Incrementer from "../fields/Incrementer.svelte";
    import { DOOMSONG } from "../../consts";

    let { context } = $props();
    let app = $derived(context.app);
    let attack_id = $derived(context.attack_id);
    let attacker = $derived(context.attacker);
    let defender = $derived(context.defender);

    let footing_spent = $state(0);
    let bonus = $state(0);
    function submit(e) {
        console.log("Submit");
        e.preventDefault();
        e.stopPropagation();
        game.socket.send(
            `${game.system.id}.${DOOMSONG.socket.attack.finish_defense}`,
        );
        // game.socket.send
    }
</script>

<form onsubmit={submit}>
    <div class="wide">
        <img class="wide" src={attack_img} alt="An axe striking a shield" />
    </div>
    <p class="wide">Spend footing to dodge or block</p>
    <label for="footing_spent">Footing Spent:</label>
    <Incrementer
        type="number"
        name="footing_spent"
        min="0"
        max={defender.actor.system.footing}
        bind:value={footing_spent}
    />

    <label for="bonus_dodge">Bonus Dodge:</label>
    <Incrementer type="number" name="bonus_dodge" min="0" bind:value={bonus} />

    <button class="devote wide elevated">Devote</button>
</form>

<style lang="scss">
    form {
        display: grid;
        grid-template: 1fr / 1fr 1fr;
        align-items: center;
        justify-content: center;
        align-content: center;

        img {
            max-width: 200px;
            max-height: auto;
            margin: auto;
        }

        p {
            text-align: center;
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
