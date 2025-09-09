<script>
    let { context } = $props();
    let app = $derived(context.app);
    let attacker = $derived(context.attacker);
    let defender = $derived(context.defender);
    // let difficulty = $derived(context.);
    let valid = $derived(attacker && defender);

    function submit() {
        console.log("Submit");
        // game.socket.send
    }
</script>

{#if valid}
<div>
    <h1>{attacker.name} assails {defender.name}</h1>

</div>
{:else}
    <h1>Invalid</h1>
{/if}
