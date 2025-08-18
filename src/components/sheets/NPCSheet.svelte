<script>
    let props = $props();
    $inspect(props);
</script>

<div class="npc-sheet">
    <img class="portrait" src={props.data.img} alt="potrait" onclick={() => props.app.editImage("img")}>
    <div class="stats">

    </div>
    <div class="moves">
        <span>Moves</span>
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
        }

        .moves {
            grid-area: m;
        }

        .bio {
            grid-area: b;
        }
    }
</style>
