<script>
    import Portrait from "../../fields/Portrait.svelte";
    import ProsemirrorField from "../../fields/ProsemirrorField.svelte";
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

    <div class="row">
        <div class="col">
            <h2>Notes</h2>
            <ProsemirrorField doc={gear} path="system.notes"></ProsemirrorField>
        </div>
    </div>
</div>
