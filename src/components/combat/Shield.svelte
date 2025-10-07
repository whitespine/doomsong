<script>
    import UpdateInput from "../fields/UpdateInput.svelte";
    import { resolveDotpath } from "../../utils/paths";
    let { actor } = $props();
</script>

<div class="shield">
    {#each ["system.toughness.max", "system.toughness.value", "system.footing.max", "system.footing.value"] as path}
        <UpdateInput
            name={path}
            doc={actor}
            {path}
            value={resolveDotpath(actor, path, 0)}
            type="number"
            style="height: 40cqh"
        />
    {/each}
</div>

<style lang="scss" module>
    .shield {
        container-type: size;

        padding-top: 28%;
        padding-left: 5%;
        padding-right: 30%;
        padding-bottom: 12%;

        aspect-ratio: 489 / 545;
        background-image: url("$assets/misc/StatusShield.png");
        background-size: contain;
        background-repeat: no-repeat;

        display: grid;
        grid-template: 1fr 1fr / 1fr 1fr;

        input {
            // max-width: 25px;
            text-align: center;
            background: transparent;
            border: none;
            padding: 0px;
            color: black;
            font-size: 30cqh;
        }
    }
</style>
