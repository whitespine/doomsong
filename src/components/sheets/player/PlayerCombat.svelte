<script>
    import {DoomsongItem} from "../../../documents/item.svelte";
    import Moves from "../../combat/Moves.svelte";
    import Shield from "../../combat/Shield.svelte";
    import ViewWeapon from "../../items/ViewWeapon.svelte";

    let { app, context } = $props();
    let actor = $derived(context.actor);
    let items = $derived(Array.from(Object.values(context.actor.items.svelte)));
    let weapons = $derived(items.filter((i) => i.type == "weapon"));
    let unarmed = new DoomsongItem({
        type: "weapon",
        name: "Unarmed",
        system: {
            roll_type: "attack_i"
        }
    }); // An ephemeral item just for display purposes
</script>

<div class="container">
    <div class="row">
        <div class="col">
            <Moves actor={context.actor} moves={context.actor.system.moves} />
        </div>
    </div>
    <div class="row sep">
    </div>
    <div class="row">
        <div class="col-8 attack">
            <h2>Attack!</h2>
            {#each [...weapons, unarmed] as weapon}
                <ViewWeapon {weapon}/>  
            {/each}
        </div>
        <div class="col-4 shield">
            <Shield {actor} />
        </div>
    </div>
</div>

<style lang="scss">
    .sep {
        border-top: 1px solid black;
    }

    .attack {
        text-align: center;
        display: flex;
        flex-direction: column;
    }
</style>
