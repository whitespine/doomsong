<script>
    import UpdateInput from "../fields/UpdateInput.svelte";
    import {resolveDotpath} from "../../utils/paths";
    let { actor } = $props();
</script>

<div class="shield">
    {#each ["system.toughness.max", "system.toughness.value", "system.footing.max", "system.footing.value"] as path}
        <UpdateInput
            name={path}
            doc={actor}
            path={path}
            value={resolveDotpath(actor, path, 0)}
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
        background-repeat: no-repeat;

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
