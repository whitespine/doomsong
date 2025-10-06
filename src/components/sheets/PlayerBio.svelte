<script>
    import { stop } from "../../utils/handlers";
    import ProsemirrorField from "../fields/ProsemirrorField.svelte";
    import Experience from "../fields/Experience.svelte";
    import UpdateInput from "../fields/UpdateInput.svelte";
    let { app, context } = $props();
    let actor = $derived(context.actor);
    /*
    https://getbootstrap.com/docs/5.1/layout/css-grid/#responsive
    */
</script>

<div class="container">
    {#snippet field(key, label, path, grid_classes = "col")}
        <div class={`${grid_classes}`}>
            <label for={key}>{label}:</label>
            <UpdateInput name={key} doc={actor} {path} type="text" />
        </div>
    {/snippet}
    <div class="row">
        {@render field("birth_name", "Birth Name", "system.birth_name")}
        {@render field("nickname", "Nickname", "system.nickname")}
    </div>
    <div class="row">
        {@render field("name", "Actor Name", "name")}
        {@render field("player_name", "Player Name", "system.player_name")}
    </div>
    <div class="row">
        {@render field("heresy", "Heresy", "system.heresy")}
        {@render field("vow", "Vow", "system.vow")}
    </div>
    <div class="row">
        {@render field("goal", "Goal", "system.goal")}
        <div class="xp col">
            <span>XP:</span>
            <Experience {actor} />
        </div>
    </div>
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
