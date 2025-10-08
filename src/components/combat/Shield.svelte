<script>
    import UpdateInput from "../fields/UpdateInput.svelte";
    import { resolveDotpath } from "../../utils/paths";
    let { actor } = $props();
</script>

<div class="shield">
    <div class="stats">
        {#each ["system.toughness.max", "system.toughness.value", "system.footing.max", "system.footing.value"] as path}
            <div style:grid-area={path.replaceAll(".", "")}>
                <UpdateInput
                    name={path}
                    doc={actor}
                    {path}
                    type="number"
                    style="height: 100%"
                />
            </div>
        {/each}
    </div>
    <div class="protection">
        <UpdateInput
            name="system.protection"
            doc={actor}
            path="system.protection"
            type="number"
            style="height: 100%"
        />
    </div>
</div>

<style lang="scss" module>
    .shield {
        // Fix width image
        container-type: size;
        aspect-ratio: 489 / 545; // The dimensions of the shield image
        height: var(--size, unset);
        background-image: url("$assets/misc/StatusShield.png");
        background-size: contain;
        background-repeat: no-repeat;

        // Make protection and stats overlap just fine
        position: relative;
        & > * {
            position: absolute;
        }

        .stats {
            top: 17%;
            left: 5%;
            width: 67%;
            height: 65%;
            display: grid;
            grid-template:
                "systemtoughnessmax   systemtoughnessvalue" 50%
                "systemfootingmax     systemfootingvalue  " 50% / 50% 50%;
        }

        .protection {
            top: 8%;
            left: 60%;
            font-size: 18cqh;
            height: 20%;
        }

        input {
            // max-width: 25px;
            text-align: center;
            background: transparent;
            border: none;
            padding: 0px;
            color: black;
            font-size: 18cqh;
        }
    }
</style>
