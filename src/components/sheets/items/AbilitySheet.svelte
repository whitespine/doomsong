<script>
    import Portrait from "../../fields/Portrait.svelte";
    import EditAbility from "../../items/EditAbility.svelte";

    let { context, app } = $props();
    let edit = $derived(app.isEditable);
    let ability = $derived(context.item);
</script>

<button hidden disabled>Snake Eater</button>
<div class="container">
    <div class="row">
        <div class="col">
            <div>
                <Portrait
                    height="128px"
                    style="margin-left: auto; margin-right: auto"
                    doc={ability}
                    path="img"
                    {edit}
                />
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <EditAbility {ability} />
        </div>
    </div>
</div>
