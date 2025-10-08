<script>
    import {stop} from "../../utils/handlers";
    let {weapon} = $props();
</script>


<div class="weapon">
    <img class="thumbnail" src={weapon.img} alt="{weapon.name} icon">
    <div class="body">
        <h2>{weapon.name}</h2>
        <div class="tags">Tags will go here</div>
    </div>
    <button class="elevated" onclick={(e) => (stop(e), weapon.system.beginAttack())}>Strike!</button>
</div>

<style lang="scss">
    .weapon {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;

        .body {
            flex: 1;
            height: 100%;
        }

        border: 1px solid black;
    }

</style>
