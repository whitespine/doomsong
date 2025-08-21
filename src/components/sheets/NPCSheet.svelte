<script>
    import UpdateInput from "../fields/UpdateInput.svelte";
    import Die from "../rolls/Die.svelte";
    let props = $props();
    $inspect(props);

    // Add a new basic move
    function addMove(act_index) {
        props.actor.update({
            [`system.moves.${act_index}`]: props.actor.system.moves[
                act_index
            ].concat([""]),
        });
    }

    // Remove the specified move
    function deleteMove(act_index, move_index) {
        let new_move_array = [...props.actor.system.moves[act_index]];
        new_move_array.splice(move_index, 1);
        props.actor.update({
            [`system.moves.${act_index}`]: new_move_array,
        });
    }
</script>

<div class="npc-sheet">
    <img
        class="portrait"
        src={props.data.img}
        alt="potrait"
        onclick={() => props.app.editImage("img")}
    />
    <div class="stats">
        {#snippet field(key, label, path)}
            <div>
                <label for={key}>{label}:</label>
                <UpdateInput
                    name={key}
                    data={props.data}
                    document={props.actor}
                    {path}
                    type="text"
                />
            </div>
        {/snippet}
        {@render field("name", "Name", "name")}
        {@render field(
            "max_toughness",
            "Max Toughness",
            "system.max_toughness",
        )}
        {@render field("toughness", "Toughness", "system.toughness")}
        {@render field("protection", "Protection", "system.protection")}
        {@render field("action_dice", "Action Dice", "system.base_action_dice")}
        {@render field("max_footing", "Max Footing", "system.max_footing")}
        {@render field("footing", "Footing", "system.footing")}
        {@render field(
            "min_difficulty",
            "Minimum Difficulty",
            "system.min_difficulty",
        )}
    </div>
    <div class="moves">
        {#each props.data.system.moves as act_moves, act_index}
            <div class="act-body">
                <Die
                    value={act_index + 1}
                    style="width: 32px; height: 32px; cursor: pointer"
                    onclick={() => addMove(act_index)}
                    data-tooltip="Add a move to this act"
                />
                <div class="move-options">
                    {#if act_moves.length == 0}
                        <span>Click the die to add a move. Otherwise, this creature will be unable to do much in this act.</span>
                    {/if}
                    {#each act_moves as move, move_index}
                        <div class="move">
                            <UpdateInput
                                tag="textarea"
                                document={props.actor}
                                data={props.data}
                                path={`system.moves.${act_index}.${move_index}`}
                                style="resize: vertical"
                            />
                            <a
                                onclick={() =>
                                    deleteMove(act_index, move_index)}
                                aria-label={`Delete move: ${move}`}
                            >
                                <i class="fas fa-trash"></i>
                            </a>
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    </div>

    <div class="bio">
        <span>Description</span>
    </div>
</div>

<style lang="scss" module>
    .npc-sheet {
        display: grid;
        grid-template:
            "p s" 128px
            "m m" 1fr
            "b b" 1fr / 128px 1fr;

        .portrait {
            grid-area: p;
            border: 1px solid black;
        }

        .stats {
            grid-area: s;
            display: grid;
            grid-template: 1fr / repeat(4, 1fr);
        }

        .moves {
            grid-area: m;
            border: 1px solid black;
            margin: 10px 15px;

            .act-body {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-items: center;
                padding: 5px 0px; // Give a bit of spacing on the top and bottom

                .move-options {
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                    grid-area: moves;

                    .move {
                        display: flex;
                        flex-direction: row;
                        align-items: center;

                        input {
                            flex-grow: 1;
                        }
                    }

                    i {
                        padding: 0px 10px;
                    }
                }
            }
        }

        .bio {
            grid-area: b;
        }
    }
</style>
