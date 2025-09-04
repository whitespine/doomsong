<script>
    let { trait } = $props();
    let trait_body = $derived(trait.replaceAll("+", "").toLocaleUpperCase());
    let defined = $derived(trait.startsWith("+"));
    let epitome = $derived(trait.startsWith("++"));
</script>

<span class={[defined && "defined", epitome && "epitome"]}>{trait_body}</span>

<style lang="scss">
    .defined {
        text-decoration-line: underline;
    }

    .epitome {
        text-decoration-style: double;
    }
</style>
