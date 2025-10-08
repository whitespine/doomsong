<script>
    import { stop } from "../../utils/handlers";
    let { weapon } = $props();
    import { resultTables } from "../../utils/roll.svelte";

    let table = $derived(
        resultTables()[weapon.system.roll_type] ?? resultTables()["attack_i"],
    );
</script>

<div class="weapon">
    <img class="thumbnail" src={weapon.img} alt="{weapon.name} icon" />
    <div class="body">
        <h2>{weapon.name}</h2>
        <p>{table.label}</p>
        <p class="tags"></p>
    </div>
    <button
        class="elevated"
        onclick={(e) => (stop(e), weapon.system.beginAttack())}>Strike!</button
    >
</div>

<style lang="scss">
    .weapon {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;

        .body {
            flex: 1;
            height: 100%;

            p {
                margin: 0px;
            }
        }

        border: 1px solid black;
    }
</style>
