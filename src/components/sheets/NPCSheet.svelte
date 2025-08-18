<script>
    import UpdateTextField from "../fields/UpdateInput.svelte";
    import Dice from "../rolls/Dice.svelte";
    let props = $props();
    $inspect(props);
</script>

<div class="npc-sheet">
    <img
        class="portrait"
        src={props.data.img}
        alt="potrait"
        onclick={() => props.app.editImage("img")}
    />
    <div class="stats">
        {#snippet field(key, label, path)}
        <div>
            <label for={key}>{label}:</label>
            <UpdateTextField name={key} document={props.actor} path={path} type="text" />
        </div>
        {/snippet}
        {@render field("name", "Name", "name")}
        {@render field("max_toughness", "Max Toughness", "system.max_toughness")}
        {@render field("toughness", "Toughness", "system.toughness")}
        {@render field("protection", "Protection", "system.protection")}
        {@render field("max_footing", "Max Footing", "system.max_footing")}
        {@render field("footing", "Footing", "system.footing")}
    </div>
    <div class="moves">
        <span>Moves</span>
        {#each [1,2,3,4,5,6] as act}
        <div class="move-options">
            <Dice value={act} style="width: 32px; height: 32px" />
            <div class="flexcol">

            </div>
        </div>
        {/each}
    </div>

    <div class="bio">
        <span>Description</span>
    </div>
</div>

<style lang="scss">
    .npc-sheet {
        display: grid;
        grid-template:
            "p s" 128px
            "m m" 1fr
            "b b" 1fr / 128px 1fr;

        .portrait {
            grid-area: p;
            border: 1px solid black;
        }

        .stats {
            grid-area: s;
            display: grid;
            grid-template: 1fr / repeat(3, 1fr);
        }

        .moves {
            grid-area: m;

            .move-options {
                display: flex;
                flex-direction: row;
            }
        }

        .bio {
            grid-area: b;
        }
    }
</style>
