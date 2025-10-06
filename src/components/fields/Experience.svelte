<script>
    import { stop } from "../../utils/handlers";
    let { actor } = $props();
    let xp = $derived(actor.system.xp);

    function clickXP(number) {
        if (xp == number) {
            number--;
        }
        actor.update({ "system.xp": number });
    }
</script>

<div class="container">
    <div class="xp row">
        {#each { length: 10 } as _, i}
            <button
                class={{ col: true, checked: xp >= i }}
                onclick={(e) => (stop(e), clickXP(i))}
                aria-label={`Set xp to ${xp == i ? i - 1 : i}`}
            ></button>
        {/each}
    </div>
</div>

<style lang="scss">
    .container {
        margin-top: 6px;
    }
    button {
        --size: 16px;
        min-width: var(--size);
        max-width: var(--size);
        min-height: var(--size);
        max-height: var(--size);

        border: solid black 2px;
        background-color: white;
        margin: 1px;
        &.checked {
            background-color: black;
        }
    }
</style>
