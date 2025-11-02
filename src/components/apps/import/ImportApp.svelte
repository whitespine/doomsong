<script>
    import { stop } from "../../../utils/handlers";
    import Splicer from "./Splicer.svelte";

    /**
     * @type {({
     *   type: string,
     *   text: string,
     *   marker_options: SpliceMarker[]
     * })}
     */
    let { text = "", type, marker_options } = $props();

    /** @type {Splicer} */
    let splicer;


    function commit() {
        console.error(splicer.results());
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
