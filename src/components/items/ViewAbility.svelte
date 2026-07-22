<script>
    import { stop } from "../../utils/handlers";
    import DeleteButton from "../fields/DeleteButton.svelte";
    import EditButton from "../fields/EditButton.svelte";
    import Portrait from "../fields/Portrait.svelte";
    import SendToChatButton from "../fields/SendToChatButton.svelte";
    import ViewButton from "../fields/ViewButton.svelte";

    let { ability, edit = false, chat = true } = $props();
</script>

<div class="ability">
    <div class="header">
        {#if ability.img != ability.constructor.getDefaultArtwork().img}
            <Portrait
                height="64px"
                doc={ability}
                path="img"
                edit={false}
            />
        {/if}
        <h2>
            {ability.name}
        </h2>
        {#if edit}
            <EditButton doc={ability} />
            <DeleteButton doc={ability} />
        {:else}
            <ViewButton doc={ability} />
        {/if}
        {#if chat}
            <SendToChatButton doc={ability} />
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
        align-items: center;

        h2 {
            margin-left: 10px;
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
