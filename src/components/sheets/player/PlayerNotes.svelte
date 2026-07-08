<script>
    import { stop } from "../../../utils/handlers";
    import ProsemirrorField from "../../fields/ProsemirrorField.svelte";
    import UpdateInput from "../../fields/UpdateInput.svelte";
    let { app, context } = $props();
    let actor = $derived(context.actor);
    /*
    https://getbootstrap.com/docs/5.1/layout/css-grid/#responsive
    */
</script>

<div class="container">
    <div class="row">
        <div class="col">
            <h2>Biography</h2>
            <ProsemirrorField doc={actor} path="system.biography"></ProsemirrorField>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <h2>Notes</h2>
            <ProsemirrorField doc={actor} path="system.notes"></ProsemirrorField>
        </div>
    </div>
</div>

<style lang="scss" module>
    .col {
        display: flex;
        flex-direction: column;
    }
    
    prose-mirror {
        --min-height: 300px;
    }
</style>
