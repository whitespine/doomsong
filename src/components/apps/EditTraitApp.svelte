<script>
    import { stop } from "../../utils/handlers";
    import UpdateInput from "../fields/UpdateInput.svelte";

    let { doc, path, app } = $props();

    let tag = $derived(resolveDotpath(doc, path, { text: "", level: 0}));
    let level = $derived(tag.level);

    function setLevel(prefix) {
        doc.update({
            [path]: `${prefix}${clean_value}`,
        });
        app.close();
    }  

    function remove() {
        let split_path = path.split(".");
        split_path[split_path.length - 1] =
            `-=${split_path[split_path.length - 1]}`;
        let removal_path = split_path.join(".");
        doc.update({
            [removal_path]: null,
        });
        app.close();
    }
</script>

<div>
    <UpdateInput {doc} path="{path}.text" name="text" />
    <div class="levels">
        <button onclick={() => (stop(e), setLevel(0))} aria-label="Normal">Normal</button>
        <button onclick={() => (stop(e), setLevel(1))} aria-label="Defining">Defining</button>
        <button onclick={() => (stop(e), setLevel(2))} aria-label="Epitome">Epitome</button>
        <button onclick={() => (stop(e), remove())} aria-label="Remove">Remove</button>
    </div>
</div>

<style lang="scss">

    .levels {
        display: flex;
        flex-direction: row;
        & > * {
            flex: 1;
        }
    }
</style>