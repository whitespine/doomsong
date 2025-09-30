
<script>
    import Defense from "./Defense.svelte";
    import { AttackFlow, FLOW_STEPS } from "../../../apps/dodge_prompt.svelte";
    import AttackRoll from "./AttackRoll.svelte";

    let { context } = $props();
    let app = $derived(context.app);

    /**
     * @type {AttackFlow}
     */
    let flow = $derived(app.flow);

    let attacker = $derived(fromUUIDSync(flow.attack.attacker))
    let defender = $derived(fromUUIDSync(flow.target))


</script>

{#if flow.step == FLOW_STEPS.DEFENSE}
    <Defense {app} {flow} {attacker} {defender} />
{:else if flow.step == FLOW_STEPS.ROLL}
    <AttackRoll {app} {flow} {attacker} {defender} />
{/if}