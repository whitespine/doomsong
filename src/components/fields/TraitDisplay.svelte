<script>
    let { trait } = $props();
    let trait_body = $derived(trait.replaceAll("+", "").toLocaleUpperCase());
    let defined = $derived(trait.level >= 1);
    let epitome = $derived(trait.level >= 2);
</script>

<span class={[defined && "defined", epitome && "epitome"]}>{trait.text}</span>

<style lang="scss">
    .defined {
        text-decoration-line: underline;
    }

    .epitome {
        text-decoration-style: double;
    }
</style>
