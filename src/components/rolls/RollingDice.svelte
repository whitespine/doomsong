<script>
    import Dice from "./Dice.svelte";
    import { onMount, onDestroy } from "svelte";

    let value = 1;
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

<Dice {value} />
