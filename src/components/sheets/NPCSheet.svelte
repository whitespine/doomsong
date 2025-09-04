
<script>
    import NPCBlockSheet from "./NPCBlockSheet.svelte";
    import NPCEditSheet from "./NPCEditSheet.svelte";
    let {block=true, ...restProps} = $props();
</script>

{#if block}
    <NPCBlockSheet {...restProps} />
{:else}
    <NPCEditSheet {...restProps} />
{/if}