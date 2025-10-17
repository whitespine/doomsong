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
        let app = new GenericComponentApp(
            EditTrait,
            { doc, path },
            { window: { title: "Edit trait" } },
        );
        app.render({ force: true });
    }
</script>

<div>
    <span
        class={{
            defining: level >= 1,
            epitome: level >= 2,
        }}>{text}</span
    >

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

            &.defining {
                text-decoration-line: underline;
            }
            &.epitome {
                text-decoration-style: double;
            }
        }
    }
</style>
