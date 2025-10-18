<script>
    import Portrait from "../../fields/Portrait.svelte";
    import {
        griddedSelect,
        griddedTextField,
    } from "../GenericSheetSnippets.svelte";
    let { context, app } = $props();
    let weapon = $derived(context.item);
    let edit = $derived(app.isEditable);

    const attack_types = {
        attack_b: "Bludgeoning",
        attack_s: "Slashing",
        attack_p: "Piercing",
        attack_i: "Improvised",
    };
</script>

<div class="container">
    <div class="row">
        <div class="col">
            <div style:margin-left="auto" style:margin-right="auto">
                <Portrait
                    height="128px"
                    style="margin-left: auto; margin-right: auto"
                    doc={weapon}
                    {edit}
                />
            </div>
        </div>
    </div>
    {@render griddedTextField(weapon, "Name", "name")}
    {@render griddedTextField(weapon, "Tags", "system.tags")}
    {@render griddedSelect(
        weapon,
        "Damage Type",
        "system.attack_type",
        attack_types,
    )}
</div>
