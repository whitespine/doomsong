<script>
    let { value, discarded, size: raw_size } = $props();
    let size = $derived((raw_size || "32px").toString());
</script>

<img
    style={{ width: size, height: size }}
    class={{ discarded: !!discarded }}
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
