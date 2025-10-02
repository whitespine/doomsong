
<script>
    import NPCBlockSheet from "./NPCBlockSheet.svelte";
    import NPCEditSheet from "./NPCEditSheet.svelte";
    let {block=true, context} = $props();
</script>

{#if block}
    <NPCBlockSheet {context} />
{:else}
    <NPCEditSheet {context} />
{/if}