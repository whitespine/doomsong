<script>
    import Portrait from "../../fields/Portrait.svelte";
    import { griddedTextField } from "../GenericSheetSnippets.svelte";
    let { context, app } = $props();
    let gear = $derived(context.item);
    let edit = $derived(app.isEditable);
</script>

<div class="container">
    <div class="row">
        <div class="col">
            <div>
                <Portrait
                    height="128px"
                    style="margin-left: auto; margin-right: auto"
                    doc={gear}
                    {edit}
                />
            </div>
        </div>
    </div>
    {@render griddedTextField(gear, "Name", "name")}
</div>
