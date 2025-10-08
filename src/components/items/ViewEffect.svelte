
<script>
    import UpdateInput from "../fields/UpdateInput.svelte";

    let { effect, edit = false } = $props();
</script>

<div class="root">
    <img class="thumbnail" src={effect.img ?? "icons/svg/aura.svg"} alt="{effect.name} icon">
    {#if edit}
        <UpdateInput
            name={"name"}
            doc={effect}
            path="name"
            type="text"
        />
        <button onclick={() => effect.delete()} aria-label="Delete {effect.name}">
            <i class="fas fa-trash"> </i>
        </button>
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
