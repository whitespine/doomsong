<script>
    import Act from "./Act.svelte";
    let { cc } = $props();
</script>

<div class="flexcol">
    {#each [1, 2, 3, 4, 5, 6] as act}
        <Act {act} {cc}></Act>
    {/each}
</div>
