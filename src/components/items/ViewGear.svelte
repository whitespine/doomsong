<script>
    import DeleteButton from "../fields/DeleteButton.svelte";
    import UpdateInput from "../fields/UpdateInput.svelte";

    let { gear, edit = false } = $props();
</script>

<div class="root">
    <!--<img class="thumbnail" src={gear.img} alt="{gear.name} icon">-->
    {#if edit}
        <UpdateInput
            name={"name"}
            doc={gear}
            path="name"
            type="text"
        />
        <DeleteButton doc={gear} />
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
        padding: 5px;

        span,
        input {
            flex: 1;
        }
    }
</style>
