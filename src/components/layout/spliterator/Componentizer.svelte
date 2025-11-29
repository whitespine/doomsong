<script>
    import {componentize} from "./spliterator";
    let { text, spliterators } = $props();


    let components = $derived(componentize(text, spliterators));
</script>

<p>
    {#each components as {component: Component, props}}
        <Component {...props} />
    {/each}
</p>
