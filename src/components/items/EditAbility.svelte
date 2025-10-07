<script>
    import UpdateInput from "../fields/UpdateInput.svelte";
    import { stop } from "../../utils/handlers";

    let { ability } = $props();

    // Delete the rank with the specified id, and demote all ranks above it. Technically this isn't the cleanest way of doing this, but whatever
    async function deleteRank(id) {
        let mods = {
            [`system.ranks.-=${id}`]: null, // Begin with just a deletion
        };
        // But also find all ranks we need to down-rank
        for (let [other_id, rank] of Object.entries(ability.system.ranks)) {
            if (rank.rank > ability.system.ranks[id].rank) {
                mods[`system.ranks.${other_id}.rank`] = rank.rank - 1; // Decrement
            }
        }
        await ability.update(mods);

        if (Object.keys(ability.system.ranks).length == 0) {
            ability.delete();
        }
    }

    // Add a new rank
    function addRank() {
        let all_ranks = ability.system.sorted_ranks;
        let last_rank =
            all_ranks.length > 0 ? all_ranks[all_ranks.length - 1].rank : 0;
        let new_rank = last_rank + 1;
        ability.update({
            [`system.ranks.${foundry.utils.randomID()}`]: {
                rank: new_rank,
                text: `Rank ${new_rank} text`,
            },
        });
    }
</script>

<div class="ability">
    <div class="header">
        <label for={`${ability._id}.name`}>Ability:</label>
        <UpdateInput
            tag="input"
            type="text"
            name={`${ability._id}.name`}
            doc={ability}
            path={"name"}
            style="flex: 1"
        />
        <button aria-label={`Add Rank`} onclick={(e) => (stop(e), addRank())}>
            Add rank
        </button>
    </div>

    <div class="ranks">
        {#each ability.system.sorted_ranks as rank}
            <div class="rank">
                <label for={`${ability._id}.${rank._id}.text`}
                    >Level {rank.rank}:</label
                >
                <UpdateInput
                    tag="input"
                    type="text"
                    name={`${ability._id}.${rank._id}.text`}
                    doc={ability}
                    path={`system.ranks.${rank._id}.text`}
                    style="flex: 1"
                />

                <button
                    aria-label={`Delete rank ${rank.rank}`}
                    class="delete"
                    onclick={(e) => (stop(e), deleteRank(rank._id))}
                    ><i class="fas fa-trash"></i></button
                >
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
    label {
        padding-right: 10px;
    }
    .ability {
        flex-direction: column;
        border: solid black 1px;
        margin: 4px;
        padding: 4px;

        .header {
            align-items: center;
            display: flex;
            flex-direction: row;
            padding: 8px;
        }

        .ranks {
            display: flex;
            flex-direction: column;
            padding: 8px;

            .rank {
                display: flex;
                flex-direction: row;
                align-items: center;
                margin-bottom: 5px;

                label {
                    width: 60px;
                }
            }
        }

        .delete {
            color: white;
        }
    }
</style>
