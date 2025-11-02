<script>
    let { trait } = $props();
    let trait_body = $derived(trait.text.toLocaleUpperCase());
    let defined = $derived(trait.level >= 1);
    let epitome = $derived(trait.level >= 2);
</script>

<span class={[defined && "defined", epitome && "epitome"]}>{trait_body}</span>

<style lang="scss">
    span {
        white-space: nowrap;
    }

    .defined {
        text-decoration-line: underline;
    }

    .epitome {
        text-decoration-style: double;
    }
</style>
