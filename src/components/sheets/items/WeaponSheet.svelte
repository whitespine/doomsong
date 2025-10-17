<script>
    import {
        griddedSelect,
        griddedTextField,
    } from "../GenericSheetSnippets.svelte";
    let { context, app } = $props();
    let weapon = $derived(context.item);

    const attack_types = {
        "attack_b": "Bludgeoning",
        "attack_s": "Slashing",
        "attack_p": "Piercing",
        "attack_i": "Improvised",
    }
</script>

<div class="container">
    {@render griddedTextField(weapon, "Name", "name")}
    {@render griddedTextField(weapon, "Tags", "system.tags")}
    {@render griddedSelect(weapon, "Damage Type", "system.attack_type", attack_types)}
</div>
