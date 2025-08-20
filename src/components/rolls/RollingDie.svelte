<script>
    import Die from "./Die.svelte";
    import { onMount, onDestroy } from "svelte";

    let props = $props();
    let value = $state(1);
    let interval;
    onMount(() => {
        interval = setInterval(() => {
            value = Math.ceil(Math.random() * 6);
        }, 100);
    });

    onDestroy(() => {
        if (interval) {
            clearInterval(interval);
        }
    });
</script>

<Die {value} {...props} />
