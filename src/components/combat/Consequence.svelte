<script>
    /** @import {Consequence} from "../../utils/roll.svelte" */

    /** @type {({
      consequence: Consequence,
      actor: Actor
    })}*/
    let { consequence, actor } = $props();
</script>

<button onclick={() => actor.applyConsequence(consequence)}>{consequence.label}</button>

<style lang="scss">
    button {
        padding: 5px;
        margin: 5px;
        height: unset;
    }
</style>
