<script>
    import Portrait from "../../fields/Portrait.svelte";
    import EditAbility from "../../items/EditAbility.svelte";

    let { context, app } = $props();
</script>

<button hidden disabled>Snake Eater</button>
<div class="container">
    <div class="row">
        <div class="col">
            <div style:margin-left="auto" style:margin-right="auto">
                <Portrait height="128px" doc={context.item} path="img" />
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <EditAbility ability={context.item} />
        </div>
    </div>
</div>
