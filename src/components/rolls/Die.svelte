<script>
    import { fixClasses } from "../../utils/classes";
    import one from "$assets/dice/1.png";
    import two from "$assets/dice/2.png";
    import three from "$assets/dice/3.png";
    import four from "$assets/dice/4.png";
    import five from "$assets/dice/5.png";
    import six from "$assets/dice/6.png";

    const value_map = [null, one, two, three, four, five, six];
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
    src={value_map[value]}
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
