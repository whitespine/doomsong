<script>
    import { stop } from "../../../utils/handlers";
    import Experience from "../../fields/Experience.svelte";
    import Portrait from "../../fields/Portrait.svelte";
    import TraitTag from "../../fields/TraitTag.svelte";
    import UpdateInput from "../../fields/UpdateInput.svelte";
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
    <div class="row portrait-row">
        <div class="col portrait">
            <Portrait
                doc={actor}
                path="img"
                callback={(img) => app.setImage(img)}
                height="200px"
                edit
            />
        </div>
    </div>
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
        <div class="col traits">
            {#each Object.keys(actor.system.traits) as trait_id}
                <TraitTag doc={actor} path={`system.traits.${trait_id}`} />
            {/each}
            <button class="add" onclick={() => actor.promptAddTrait()}>
                Add Trait
            </button>
        </div>
    </div>
</div>

<style lang="scss">
    .xp {
        background-color: unset;
    }

    .portrait {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .traits {
        display: flex;
        flex-direction: row;

        .add {
            margin-left: auto;
        }
    }
</style>
