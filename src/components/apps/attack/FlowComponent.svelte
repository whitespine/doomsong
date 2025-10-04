
<script>
    import { FLOW_STEPS } from "../../../apps/dodge_prompt.svelte";
    import Defense from "./Defense.svelte";
    import Roll from "./Roll.svelte";
    import Resolve from "./Resolve.svelte";
    import { inSuspense } from "../../../utils/suspense.svelte";

    /** @import { AttackFlow } from "../../../apps/dodge_prompt.svelte" */

    let { context } = $props();
    let app = $derived(context.app);

    /**
     * @type {AttackFlow}
     */
    let flow = $derived(app.flow);

    let attacker = $derived(fromUuidSync(flow.attack.attacker))
    let defender = $derived(fromUuidSync(flow.target))
</script>

{#if flow.step == FLOW_STEPS.DEFENSE}
    <Defense {app} {flow} {attacker} {defender} />
{:else if flow.step == FLOW_STEPS.RESOLVE && inSuspense(flow.roll_suspense)}
    <Roll {app} {flow} {attacker} {defender} />
{:else if flow.step == FLOW_STEPS.RESOLVE}
    <Resolve {app} {flow} {attacker} {defender} />
{:else}
    {JSON.stringify(flow)}
{/if}