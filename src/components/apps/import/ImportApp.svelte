<script>
    import { stop } from "../../../utils/handlers";
    import { import_npc } from "./splice";
    import Splicer from "./Splicer.svelte";

    /**
     * @type {({
     *   type: string,
     *   text: string,
     *   target: Document,
     *   marker_options: SpliceMarker[]
     * })}
     */
    let { app, text = "", target, type, marker_options } = $props();

    /** @type {Splicer} */
    let splicer;

    async function commit() {
        let results = splicer.results();
        if(target instanceof Actor && target.type == "npc") {
            await import_npc(target, results);
        } else {
            ui.notifications.warn("Unsupported import type");
            return;
        }
        ui.notifications.info(`Import to ${target.name} complete`);
        app.close();
    }
</script>

<div class="root">
    <textarea bind:value={text}></textarea>

    <p>
        Click on words to mark them as the the starts of different sections on {type}
    </p>

    <div class="splicer">
        <Splicer {text} {marker_options} bind:this={splicer} />
    </div>

    <button onclick={(e) => (stop(e), commit())}> IMPORT </button>
</div>

<style lang="scss">
    .root {
        display: flex;
        flex-direction: column;
        max-width: 50vw;
        max-height: 80vh;
    }

    .splicer {
        max-height: 80vh;
        overflow: hidden auto;
    }
</style>
