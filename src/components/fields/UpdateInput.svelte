<script>
    import { resolveDotpath } from "../../utils/paths";
    let { document, data, path, class: className, ...restProps } = $props();

    let value = $state(resolveDotpath(data, path, ""));

    let change_timeout = null;
    function commit(new_value, delay) {
        value = new_value;
        if (change_timeout) {
            clearTimeout(change_timeout);
            change_timeout = null;
        }
        let update = () => {
            document.update({
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

<input
    onchange={(e) => commit(e.target.value, 0)}
    oninput={(e) => commit(e.target.value, 1000)}
    {...restProps}
    class={className}
    {value}
/>
