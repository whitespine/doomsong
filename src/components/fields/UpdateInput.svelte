<script>
    import { resolveDotpath } from "../../utils/paths";
    let { tag="input", doc, source, path, class: className, ...restProps } = $props();

    let value = $derived(resolveDotpath(source, path, ""));

    let change_timeout = null;
    function commit(new_value, delay) {
        value = new_value;
        if (change_timeout) {
            clearTimeout(change_timeout);
            change_timeout = null;
        }
        let update = () => {
            doc.update({
                [path]: new_value,
            });
        };
        if (delay > 0) {
            change_timeout = setTimeout(update, delay);
        } else {
            update();
        }
    }
</script>

<svelte:element this={tag}
    onchange={(e) => commit(e.target.value, 0)}
    oninput={(e) => commit(e.target.value, 1000)}
    {...restProps}
    class={className}
    {value}
/>
