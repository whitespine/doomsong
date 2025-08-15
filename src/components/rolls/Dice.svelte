<script>
    let { value, discarded } = $props();
</script>

<img class={{discarded: !!discarded}} src={`systems/doomsong/assets/dice/${value}.png`} alt={value} />

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
