<script>
    import Act from "./Act.svelte";
    let { cc } = $props();
</script>

<div class="flexcol">
    <h1>Perform Acts</h1>
    {#each [1, 2, 3, 4, 5, 6] as act}
        <Act {act} {cc}></Act>
    {/each}
</div>
