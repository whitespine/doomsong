<script>
    import EditButton from "./EditButton.svelte";
    import { resolveDotpath } from "../../utils/paths";
    import { GenericComponentApp } from "../../apps/generic_app";
    import EditTrait from "../apps/EditTraitApp.svelte";
    let { doc, path, edit = false, edit_button } = $props();

    let tag = $derived(resolveDotpath(doc, path, ""));
    let text = $derived(tag.text);
    let level = $derived(tag.level);

    function openEdit() {
        let app = new GenericComponentApp(EditTrait, { doc, path });
        app.render({ force: true });
    }
</script>

<div
    style:text-decoration-line={level >= 1 ? "underline" : "none"}
    style:text-decoration-style={level >= 2 ? "double" : "single"}
>
    <span>{text} {level}</span>

    {#if edit}
        <EditButton callback={openEdit} />
    {/if}
</div>

<style lang="scss">
    div {
        border: 2px solid black;
        border-radius: 5px;
        margin: 2px;
        padding: 1px 3px;
        display: flex;
        flex-direction: row;
        align-items: center;

        span {
            padding-right: 2px;
        }
    }
</style>
