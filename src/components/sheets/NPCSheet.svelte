
<script>
    import NPCBlockSheet from "./NPCBlockSheet.svelte";
    import NPCEditSheet from "./NPCEditSheet.svelte";
    let {block=true, ...restProps} = $props();
</script>

<h1>{restProps.actor.name}</h1>
{#if block}
    <NPCBlockSheet {...restProps} />
{:else}
    <NPCEditSheet {...restProps} />
{/if}