<script>
    /** @import {Consequence} from "../../utils/roll.svelte" */

    /** @type {({
      consequence: Consequence,
      actor: Actor
    })}*/
    let { consequence, actor } = $props();

    let disabled = $derived(actor.permission < CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER);
    function apply() {
        if(!disabled) actor.applyConsequence(consequence);
    }
</script>

<button onclick={apply} class={{disabled}}> {consequence.label} </button>

<style lang="scss">
    button {
        padding: 5px;
        margin: 5px;
        height: unset;

        cursor: pointer;
    }
</style>
