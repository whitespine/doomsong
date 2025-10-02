<script>
    let {
        value = $bindable(),
        min = undefined,
        max = undefined,
        name = undefined,
    } = $props();

    function increment(e, delta) {
        console.log(e);
        e.preventDefault();
        e.stopPropagation();
        let new_value = value + delta;
        if (min != undefined) {
            new_value = Math.max(min, new_value);
        }
        if (max != undefined) {
            new_value = Math.min(max, new_value);
        }
        value = new_value;
    }
</script>

<div>
    <button onclick={(e) => increment(e, -1)}>-</button>
    <input
        type="number"
        {min}
        {max}
        {name}
        bind:value
    />
    <button class="invert" onclick={(e) => increment(e, 1)}>+</button>
</div>

<style lang="scss">
    div {
        display: flex;
        align-items: center;
        input {
            margin: 5px;
            min-height: none;
            text-align: center;
            flex-grow: 1;
            font-size: x-large;
        }

        button {
            --button-size: 1.5em;
            font-size: x-large;
            width: 1.5em;
            padding: 15px;
            min-height: none;
            min-width: none;
        }
    }
</style>
