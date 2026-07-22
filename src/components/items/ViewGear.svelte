<script>
    import DeleteButton from "../fields/DeleteButton.svelte";
    import EditButton from "../fields/EditButton.svelte";
    import Portrait from "../fields/Portrait.svelte";
    import SendToChatButton from "../fields/SendToChatButton.svelte";
    import UpdateInput from "../fields/UpdateInput.svelte";
    import ViewButton from "../fields/ViewButton.svelte";

    let { gear, edit = false, chat = true } = $props();
</script>

<div class="gear">
    <Portrait doc={gear} {edit} height="var(--gear-portrait-size)" />
    {#if edit}
        <UpdateInput name={"name"} doc={gear} path="name" type="text" />
        <EditButton doc={gear} />
        <DeleteButton doc={gear} />
    {:else}
        <span>{gear.name}</span>
        <ViewButton doc={gear} />
    {/if}    
    {#if chat}
        <SendToChatButton doc={gear} />
    {/if}
</div>

<style lang="scss">
    .gear {
        border: 1px solid black;
        display: flex;
        flex-direction: row;
        align-items: center;

        span,
        input {
            flex: 1;
        }
        padding-right: 5px;
    }
</style>
