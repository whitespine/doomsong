<script>
    import DeleteButton from "../fields/DeleteButton.svelte";
    import EditButton from "../fields/EditButton.svelte";
    import Portrait from "../fields/Portrait.svelte";
    import SendToChatButton from "../fields/SendToChatButton.svelte";
    import UpdateInput from "../fields/UpdateInput.svelte";
    import ViewButton from "../fields/ViewButton.svelte";

    let { effect, edit = false, chat = true } = $props();
</script>

<div class="root">
    <Portrait
        doc={effect}
        path="img"
        fallback="icons/svg/aura.svg"
        height="64px"
    />
    {#if edit}
        <UpdateInput name={"name"} doc={effect} path="name" type="text" />
        <EditButton doc={effect} />
        <DeleteButton doc={effect} />
    {:else}
        <span>{effect.name}</span>
        <ViewButton doc={effect} />
    {/if}
    {#if chat}
        <SendToChatButton doc={effect} />
    {/if}
</div>

<style lang="scss" module>
    .root {
        border: 1px solid black;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 5px;

        span,
        input {
            flex: 1;
            margin-left: 8px;
            margin-right: 8px;
        }
    }
</style>
