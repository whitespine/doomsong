<script>
    import Portrait from "../../fields/Portrait.svelte";
    import { griddedTextField } from "../GenericSheetSnippets.svelte";
    let { context, app } = $props();
    let edit = $derived(app.isEditable);
    let armor = $derived(context.item);
</script>

<div class="container">
    <div class="row">
        <div class="col">
            <div>
                <Portrait
                    height="128px"
                    style="margin-left: auto; margin-right: auto"
                    doc={armor}
                    {edit}
                />
            </div>
        </div>
    </div>
    {@render griddedTextField(armor, "Name", "name")}
    {@render griddedTextField(armor, "Bulk", "system.bulk")}
</div>
