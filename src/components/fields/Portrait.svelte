<script>
    import { stop } from "../../utils/handlers";

    let { doc, path, callback = null, addStyle="", restArgs } = $props();


    let current = $derived(foundry.utils.getProperty(doc, path));
    let restArgsWithDefaultStyle = $derived({
        style: "min-width: 256px; max-width: 256px; min-height: 256px; max-height: 256px;" + addStyle,
        ...restArgs,
    });

    // Stolen from foundry, modified
    async function editImage(e) {
        stop(e);
        const defaultArtwork =
            doc.constructor.getDefaultArtwork?.(doc._source) ?? {};
        const defaultImage = foundry.utils.getProperty(defaultArtwork, path);
        // const fp = new FilePicker.implementation({ // v13
        const fp = new FilePicker({
            current,
            type: "image",
            redirectToRoot: defaultImage ? [defaultImage] : [],
            callback: callback,
            // position: {
            // top: this.position.top + 40,
            // left: this.position.left + 10
            // }
        });
        await fp.browse();
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<img src={current} alt="potrait" onclick={editImage} {...restArgsWithDefaultStyle} />

<style lang="scss">
    img {
        cursor: pointer;
        object-fit: contain;
        border: 2px solid black;
    }
</style>
