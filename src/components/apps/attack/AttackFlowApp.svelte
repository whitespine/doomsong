
<script>
    import Defense from "./AttackDefend.svelte";
    import { AttackFlow, FLOW_STEPS } from "../../../apps/dodge_prompt.svelte";

    let { context } = $props();
    let app = $derived(context.app);

    /**
     * @type {AttackFlow}
     */
    let flow = $derived(app.flow);

    let attacker = $derived(fromUUIDSync(flow.attack.attacker))
    let defender = $derived(fromUUIDSync(flow.target))


</script>

{#if flow.mode == FLOW_STEPS.DEFENSE}
    <Defense {flow} {attacker} {defender} />
{:else if context.mode == ""}
{/if}