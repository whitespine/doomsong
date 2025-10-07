<script>
    let { ability } = $props();
</script>

<div class="ability">
    <h2>{ability.name}</h2>

    {#each ability.system.sorted_ranks as rank}
        <div class="rank">
            <span class="bold">
                Level {rank.rank}:
            </span>
            <span>
                {rank.text}
            </span>
        </div>
    {/each}
</div>

<style lang="scss">
    .ability {
        flex-direction: column;
        border: solid black 1px;
        margin: 4px;
        padding: 4px;
    }
</style>
