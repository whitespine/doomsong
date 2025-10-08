<script>
    let { gear, edit = false } = $props();
</script>

<div class="root">
    {#if edit}
        <span>{gear.name}</span>
        <button onclick={() => gear.delete()} aria-label="Delete {gear.name}">
            <i class="fas fa-trash"> </i>
        </button>
    {:else}
        <span>{gear.name}</span>
    {/if}
</div>

<style lang="scss">
    .root {
        border: 1px solid black;
        display: flex;
        flex-direction: row;
        align-items: center;
        
        span, input {
            flex: 1
        }
    }
</style>