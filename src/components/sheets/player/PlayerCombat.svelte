<script>
    import Moves from "../../combat/Moves.svelte";

    let { app, context } = $props();
</script>

<Moves actor={context.actor} moves={context.actor.system.moves} />
