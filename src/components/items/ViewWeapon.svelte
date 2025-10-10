<script>
    import { stop } from "../../utils/handlers";
    let { weapon, edit = false, strike = false } = $props();
    import { resultTables } from "../../utils/roll.svelte";
    import DeleteButton from "../fields/DeleteButton.svelte";
    import Portrait from "../fields/Portrait.svelte";

    let table = $derived(
        resultTables()[weapon.system.roll_type] ?? resultTables()["attack_i"],
    );
</script>

<div class="weapon">
    <Portrait doc={weapon} {edit} height="48px" />
    <div class="body">
        <h2>{weapon.name}</h2>
        <p>{table.label}</p>
        <p class="tags"></p>
    </div>
    {#if strike}
        <button
            class="elevated"
            onclick={(e) => (stop(e), weapon.system.beginAttack())}
        >
            Strike!
        </button>
    {/if}
    {#if edit}
        <DeleteButton doc={weapon} />
    {/if}
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
