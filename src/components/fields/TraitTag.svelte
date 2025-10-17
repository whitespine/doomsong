<script>
    import { resolveDotpath } from "../../utils/paths";
    let { doc, path, edit, edit_button } = $props();

    let value = $derived(resolveDotpath(doc, path, ""));
    let clean_value = $derived(value.replaceAll("+", ""));
    let clazz = $derived.by(() => {
        let leading_plusses = 0;
        for (let c of value) {
            if (c == "+") {
                leading_plusses++;
            } else break;
        }
        return ["", "defining", "super defining"][leading_plusses] || "";
    });

    function cycle() {
        if (!edit) return;
        if (!value || !doc) return;
        let new_value;
        if (value?.startsWith("++")) {
            new_value = clean_value;
        } else if (value?.startsWith("+")) {
            new_value = `++${clean_value}`;
        } else if (value?.startsWith("")) {
            new_value = `+${clean_value}`;
        }
        doc.update({
            [path]: new_value,
        });
    }

    function remove() {
        if (!edit) return;
        let split_path = path.split(".");
        split_path[split_path.length - 1] =
            `-=${split_path[split_path.length - 1]}`;
        let removal_path = split_path.join(".");
        doc.update({
            [removal_path]: null,
        });
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    onclick={cycle}
    oncontextmenu={remove}
    class={clazz}
    style:cursor={edit ? "pointer" : "inherit"}
>
    {clean_value}
</div>

<style lang="scss">
    div {
        border: 2px solid black;
        border-radius: 5px;
        margin: 2px;
        padding: 1px 3px;

        &.defining {
            text-decoration-line: underline;
        }

        &.super.defining {
            text-decoration-style: double;
        }
    }
</style>
