<script>
    import UpdateInput from "../fields/UpdateInput.svelte";
    import Dice from "../rolls/Dice.svelte";
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
                <Dice
                    value={act_index + 1}
                    style="width: 32px; height: 32px; grid-area: die"
                />
                <div class="move-options">
                    {#each act_moves as move, move_index}
                        <div class="move">
                            <UpdateInput
                                document={props.actor}
                                data={props.data}
                                path={`system.moves.${act_index}.${move_index}`}
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
                <a
                    class="add-move"
                    onclick={() => addMove(act_index)}
                    aria-label={`add move to act ${act_index + 1}`}
                >
                    <i class="fas fa-plus"></i>
                </a>
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
                display: grid;
                grid-template:
                    "die moves" 1fr
                    "null add" 32px / 50px 1fr;
                align-items: center;
                justify-items: center;

                .move-options {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
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
                        padding: 10px;
                    }
                }

                .add-move {
                    grid-area: add;
                    border-radius: 10%;
                }
            }
        }

        .bio {
            grid-area: b;
        }
    }
</style>
