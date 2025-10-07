<script>
    import { stop } from "../../../utils/handlers";
    import Experience from "../../fields/Experience.svelte";
    import UpdateInput from "../../fields/UpdateInput.svelte";
    let { app, context } = $props();
    let actor = $derived(context.actor);
    /*
    https://getbootstrap.com/docs/5.1/layout/css-grid/#responsive
    */
</script>

<div class="container">
    <div class="row">
        <div class="bioblock">
            <label for="biography">Biography:</label>
            <UpdateInput
                name="biography"
                doc={actor}
                path="system.biography"
                type="text"
                tag="textarea"
                style="height: 15em"
            />
        </div>
    </div>
</div>

<style lang="scss">
    .bioblock {
        display: flex;
        flex-direction: column;
    }

    .xp {
        background-color: unset;
    }
</style>
