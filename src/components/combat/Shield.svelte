<script>
    import UpdateInput from "../fields/UpdateInput.svelte";
    let { context } = $props();
    let actor = $derived(context.document);
</script>

<div class="shield">
    {#each ["max_toughness", "toughness", "max_footing", "footing"] as path}
        <UpdateInput
            name={`system.${path}`}
            doc={actor}
            path={`system.${path}`}
            value={actor.system[path]}
            type="number"
        />
    {/each}
</div>

<style lang="scss" module>
    .shield {
        --shield-width: 100px;
        --shield-height: 120px;
        --top-padding: 24px;
        --left-padding: 10px;

        padding-top: var(--top-padding);
        padding-left: var(--left-padding);
        padding-right: 30px;
        padding-bottom: 20px;

        min-width: var(--shield-width);
        max-width: var(--shield-width);
        min-height: var(--shield-height);
        max-height: var(--shield-height);
        background-image: url("$assets/misc/StatusShield.png");
        background-size: 100% auto;

        display: grid;
        grid-template: 1fr 1fr / 1fr 1fr;

        input {
            max-width: 25px;
            text-align: center;
            // margin-top: 15px;
            margin-bottom: 0px;
            background: transparent;
            border: none;
            padding: 0px;
            color: black;
        }
    }
</style>
