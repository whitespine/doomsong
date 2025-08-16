<script>
    import { fixClasses } from "../../utils/classes";

    let {
        value,
        discarded,
        class: className,
        ...restProps
    } = $props();
    let fullClasses = $derived.by(() => {
        return {
            discarded: !!discarded,
            ...fixClasses(className),
        };
    });
</script>

<img
    {...restProps}
    class={fullClasses}
    src={`systems/doomsong/assets/dice/${value}.png`}
    alt={value}
/>

<style lang="scss">
    img {
        border: 0px;
        width: 32px;
        height: 32px;
    }
    .discarded {
        opacity: 33%;
    }
</style>
