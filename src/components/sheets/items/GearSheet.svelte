<script>
    import EditGear from "../../items/EditGear.svelte";

    let { context, app } = $props();
</script>

<EditGear gear={context.item} />