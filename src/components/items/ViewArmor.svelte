<script>
    let { armor, edit = false, chat = true } = $props();
    import DeleteButton from "../fields/DeleteButton.svelte";
    import EditButton from "../fields/EditButton.svelte";
    import Portrait from "../fields/Portrait.svelte";
    import SendToChatButton from "../fields/SendToChatButton.svelte";
    import ViewButton from "../fields/ViewButton.svelte";
</script>

<div class="armor">
    <Portrait doc={armor} {edit} height="var(--gear-portrait-size)" />
    <div class="body">
        <h2>{armor.name}</h2>
        <p class="tags">{armor.system.tags}</p>
    </div>
    {#if edit}
        <EditButton doc={armor} />
        <DeleteButton doc={armor} />
    {:else}
        <ViewButton doc={armor} />
    {/if}
    {#if chat}
        <SendToChatButton doc={armor} />
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
