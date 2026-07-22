<script>
    import ViewAbility from "./ViewAbility.svelte";
    import ViewArmor from "./ViewArmor.svelte";
    import ViewGear from "./ViewGear.svelte";
    import ViewEffect from "./ViewEffect.svelte";
    import ViewWeapon from "./ViewWeapon.svelte";

    let { doc, edit = false, chat = true } = $props();
</script>

{#if doc.type == "ability"}
    <ViewAbility ability={doc} {edit} {chat} />
{:else if doc.type == "armor"}
    <ViewArmor armor={doc} {edit} {chat} />
{:else if doc.type == "weapon"}
    <ViewWeapon weapon={doc} {edit} {chat} />
{:else if doc.type == "gear"}
    <ViewGear gear={doc} {edit} {chat} />
{:else if doc instanceof ActiveEffect}
    <ViewEffect effect={doc} {edit} {chat} />
{:else}
    <span>We don't know how to render {doc.name}...</span>
{/if}
