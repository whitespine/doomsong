
<script>
    import DeleteButton from "../fields/DeleteButton.svelte";
import Portrait from "../fields/Portrait.svelte";
    import UpdateInput from "../fields/UpdateInput.svelte";

    let { effect, edit = false } = $props();
</script>

<div class="root">
        <Portrait
            doc={effect}
            path="img"
            fallback="icons/svg/aura.svg"
            height="64px"
        />
    {#if edit}
        <UpdateInput
            name={"name"}
            doc={effect}
            path="name"
            type="text"
        />
        <DeleteButton doc={effect} />
    {:else}
        <span>{effect.name}</span>
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
