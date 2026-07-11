<script>
    import { stop } from "../../utils/handlers";
    let { armor, edit = false, strike = false } = $props();
    import { resultTables } from "../../utils/roll.svelte";
    import DeleteButton from "../fields/DeleteButton.svelte";
    import EditButton from "../fields/EditButton.svelte";
    import Portrait from "../fields/Portrait.svelte";
</script>

<div class="armor">
    <Portrait doc={armor} {edit} height="var(--gear-portrait-size)" />
    <div class="body">
        <h2>{armor.name}</h2>
        <p class="tags">{armor.system.tags}</p>
    </div>
    {#if strike}
        <button
            class="elevated"
            onclick={(e) => (stop(e), armor.system.beginAttack())}
        >
            Strike!
        </button>
    {/if}
    {#if edit}
        <EditButton doc={armor} />
        <DeleteButton doc={armor} />
    {/if}
</div>

<style lang="scss">
    .armor {
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
        padding-right: 5px;
    }
</style>
