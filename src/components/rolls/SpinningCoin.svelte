<script>
    import Coin from "./Coin.svelte";
    import { onMount, onDestroy } from "svelte";

    let props = $props();
    let value = $state(1);
    let interval;

    onMount(() => {
        interval = setInterval(() => {
            if(value == 1) {
                value = -1;
            } else {
                value = 1;
            }
        }, 100);
    });

    onDestroy(() => {
        if (interval) {
            clearInterval(interval);
        }
    });
</script>

<Coin {value} {...props} />
