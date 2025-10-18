<script>
    import { stop } from "../../utils/handlers";
    import DeleteButton from "../fields/DeleteButton.svelte";
    import EditButton from "../fields/EditButton.svelte";

    let { ability, edit = false } = $props();
</script>

<div class="ability">
    <div class="header">
        <h2>
            {ability.name}
        </h2>
        {#if edit}
            <EditButton doc={ability} />
            <DeleteButton doc={ability} />
        {/if}
    </div>

    {#each ability.system.unlocked_ranks as rank}
        <div class="rank">
            {#if Object.keys(ability.system.ranks).length != 1}
                <span class="bold">
                    Level {rank.rank}:
                </span>
            {/if}
            <span>
                {rank.text}
            </span>
        </div>
    {/each}
</div>

<style lang="scss">
    .header {
        display: flex;
        flex-direction: row;

        h2 {
            margin-right: auto;
        }
    }

    .ability {
        flex-direction: column;
        border: solid black 1px;
        margin: 4px;
        padding: 4px;
    }
</style>
