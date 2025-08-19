<script>
    import { resolveDotpath } from "../../utils/paths";
    let {
        document,
        data,
        path,
        debounce = 200,
        class: className,
        ...restProps
    } = $props();

    let cv = $derived(resolveDotpath(data, path, ""));

    function onChange(evt) {
        cv = evt.target.value;
        update_callback();
    }

    let update_callback = foundry.utils.debounce(() => {
        document.update({
            [path]: cv,
        });
    }, debounce);
</script>

<input
    onchange={onChange}
    oninput={onChange}
    {...restProps}
    class={className}
    value={cv}
/>
