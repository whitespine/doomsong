<script>
    import { cleanup_whitespace, cleanup_doubles } from "../../../utils/paste";
    import { stop } from "../../../utils/handlers";
    import { NULL_MARKER } from "./splice";

    /**
     * @type {({
     *   type: string,
     *   text: string,
     *   marker_options: SpliceMarker[]
     * })}
     */
    let { type, text, marker_options } = $props();

    /** @import {SpliceResult} from "./splice" */

    /** @type {string}*/
    let reformatted = $derived(cleanup_whitespace(text));

    /** @type {string[]}*/
    let tokenized = $derived.by(() => {
        let by_newlines = reformatted.split("\n");
        let result = [];
        for (let spit of by_newlines) {
            if (result.length) result.push("\n");
            result.push(...spit.split(" "));
        }
        return result;
    });

    /** @type {({[key: number]: number})}*/
    let splices = $state({});

    /** @type {Array<[string, SpliceMarker]>}*/
    let tokens_with_splices = $derived(
        tokenized.map((t, i) => [t, spliceFor(i)]),
    );

    /**
     *
     * @param {number} index Token index
     * @returns {SpliceMarker}
     */
    function spliceFor(index) {
        return marker_options[splices[index] ?? -1] || null; // NULL_MARKER;
    }

    function cycleSplice(index) {
        if (splices[index] == null) {
            splices[index] = last_set_splice || 0;
        } else if (splices[index] >= marker_options.length - 1) {
            splices[index] = null;
            last_set_splice = null;
        } else {
            splices[index] = splices[index] + 1;
            last_set_splice = splices[index];
        }
    }

    function resetSplice(index) {
        splices[index] = null;
        last_set_splice = null;
    }

    export function results() {
        // Build result
        /** @type {SpliceResult[]} */
        let result = [];
        let buffer = "";
        let last_splice = null;
        for (let [token, splice] of tokens_with_splices) {
            if (splice && last_splice) {
                if (buffer) {
                    result.push({
                        splice: last_splice,
                        text: buffer,
                    });
                }
                buffer = "";
                last_splice = splice;
            } else if (splice) {
                buffer = "";
                last_splice = splice;
            }
            buffer += token;
        }

        // Wrap up
        if (last_splice) {
            result.push({
                splice: last_splice,
                text: buffer,
            });
        }
        return result;
    }

    // What was the index of the last splice we set? We start here when marking future splices
    let last_set_splice = $state(0);
</script>

<div class="token-grove">
    {#each tokens_with_splices as [token, splice], i}
        {#if token == "\n"}
            <div class="break"></div>
        {:else}
            <button
                onclick={() => cycleSplice(i)}
                oncontextmenu={() => resetSplice(i)}
                data-tooltip={splice?.tooltip}
                class={{ splice: !!splice }}
            >
                {#if splice}
                    {#if splice.img}
                        <img src={splice.img} alt={splice.tooltip} />
                    {/if}
                    {#if splice.label}
                        <span>
                            {splice.label}
                        </span>
                    {/if}
                {/if}
                {token}
            </button>
        {/if}
    {/each}
</div>

<style lang="scss">
    .token-grove {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        max-width: 100%;

        img {
            max-width: 2em;
        }

        button {
            margin-left: none;
            padding-left: 0.1em;
            padding-right: 0.1em;
            padding-bottom: 0;
            margin-bottom: 0;

            border: none;
        }

        button:not(:hover) {
            background: none;
            color: black;
        }

        button.splice {
            background: gray;
        }

        .break {
            flex-basis: 100%;
            height: 0;
        }
    }
</style>
