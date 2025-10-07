<script>
    import NPCBlockSheet from "./NPCBlockSheet.svelte";
    import NPCEditSheet from "./NPCEditSheet.svelte";
    let { block = true, context, app } = $props();
</script>

{#if block}
    <NPCBlockSheet {app} {context} />
{:else}
    <NPCEditSheet {app} {context} />
{/if}
