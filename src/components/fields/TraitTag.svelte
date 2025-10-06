<script>
    import { resolveDotpath, spliceArrayItem, stepwiseResolveDotpath } from "../../utils/paths";
    let { doc, path } = $props();


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
        let mod = spliceArrayItem(doc, path);
        doc.update({
            [mod.array_path]: mod.modified_array
        });
    }
</script>

<div onclick={cycle} oncontextmenu={remove} class={clazz}>
    {clean_value}
</div>
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->

<style lang="scss">
    div {
        border: 2px solid black;
        border-radius: 5px;
        margin: 2px;
        padding: 1px 3px;
        cursor: pointer;

        &.defining {
            text-decoration-line: underline;
        }

        &.super.defining {
            text-decoration-style: double;
        }
    }
</style>
