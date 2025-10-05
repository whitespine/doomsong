
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

    let message = $derived(flow.message_id ? game.messages.get(flow.message_id) : null);
    let attacker = $derived(fromUuidSync(flow.attack.attacker));
    let defender = $derived(fromUuidSync(flow.target).actor); // Get the actor
</script>

{#if flow.step == FLOW_STEPS.DEFENSE}
    <Defense {app} {flow} {attacker} {defender} />
{:else if flow.step == FLOW_STEPS.RESOLVE && (inSuspense(message?.doomsong.roll_suspense) || inSuspense(message?.doomsong.coin_suspense))}
    <Roll {app} {flow} {attacker} {defender} />
{:else if flow.step == FLOW_STEPS.RESOLVE}
    <Resolve {app} {flow} {attacker} {defender} />
{:else}
    {JSON.stringify(flow)}
{/if}