<script>
    import Portrait from "../../fields/Portrait.svelte";
    import EditAbility from "../../items/EditAbility.svelte";

    let { context, app } = $props();
</script>

<button hidden disabled>Snake Eater</button>
<div class="container">
    <div class="row">
        <div class="col">
            <Portrait
                doc={context.item}
                path="img"
                addStyle="margin-left: auto; margin-right: auto"
            />
        </div>
    </div>
    <div class="row">
        <div class="col">
            <EditAbility ability={context.item} />
        </div>
    </div>
</div>
