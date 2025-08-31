<script>
    import TraitTag from "../fields/TraitTag.svelte";
    import UpdateInput from "../fields/UpdateInput.svelte";
    import Die from "../rolls/Die.svelte";
    let { data, actor, app } = $props();
    $inspect(data);

    // Add a new basic move
    function addMove(act_index) {
        actor.update({
            [`system.moves.${act_index}`]: actor.system.moves[act_index].concat(
                [""],
            ),
        });
    }

    // Remove the specified move
    function deleteMove(act_index, move_index) {
        let new_move_array = [...actor.system.moves[act_index]];
        new_move_array.splice(move_index, 1);
        actor.update({
            [`system.moves.${act_index}`]: new_move_array,
        });
    }

    // Add a new tag
    function addTag() {
        const callback = (form, prefix) => {
            let tag = new FormData(globalThis.$(form).find("form")[0]).get("tag");
            let existing_tags = [...actor.system.tags];
            existing_tags.push(`${prefix}${tag}`);
            actor.update({
                "system.tags": existing_tags
            });
        };
        let d = new Dialog({
            title: "Add a Tag",
            content: `<form><input type="text" name="tag"></input></form>`,
            buttons: {
                add: {
                    label: "Add",
                    callback: (f) => callback(f, "")
                },
                add_defining: {
                    label: "Defining",
                    callback: (f) => callback(f, "+")
                },
                add_super: {
                    label: "Epitome",
                    callback: (f) => callback(f, "++"),
                },
            },
            default: "add",
        });
        return d.render(true);
    }
</script>

<div class="npc-sheet">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <img
        class="portrait"
        src={data.img}
        alt="potrait"
        onclick={() => app.editImage("img")}
    />
    <div class="stats">
        {#snippet field(key, label, path)}
            <div>
                <label for={key}>{label}:</label>
                <UpdateInput name={key} {data} doc={actor} {path} type="text" />
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

        <UpdateInput
            class="vibes"
            name="vibes"
            placeholder="put, some, descriptors, here"
            {data}
            doc={actor}
            path="system.vibes"
            type="text"
        />
        <div class="tags">
            {#if data.system.tags.length == 0}
                Add a tag!
            {:else}
                {#each data.system.tags as tag, index}
                    <TraitTag doc={actor} {data} path={`system.tags.${index}`} />
                {/each}
            {/if}
            <button onclick={addTag}>Add Tag</button>
        </div>
    </div>
    <div class="moves">
        {#each data.system.moves as act_moves, act_index}
            <div class="act-body">
                <Die
                    value={act_index + 1}
                    style="width: 32px; height: 32px; cursor: pointer"
                    onclick={() => addMove(act_index)}
                    data-tooltip="Add a move to this act"
                />
                <div class="move-options">
                    {#if act_moves.length == 0}
                        <span
                            >Click the die to add a move. Otherwise, this
                            creature will be unable to do much in this act.</span
                        >
                    {/if}
                    {#each act_moves as move, move_index}
                        <div class="move">
                            <UpdateInput
                                tag="textarea"
                                doc={actor}
                                {data}
                                path={`system.moves.${act_index}.${move_index}`}
                                style="resize: vertical"
                            />
                            <!-- svelte-ignore a11y_click_events_have_key_events -->
                            <!-- svelte-ignore a11y_no_static_element_interactions -->
                            <!-- svelte-ignore a11y_missing_attribute -->
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
            "p s" 150px
            "m m" 1fr
            "b b" 1fr / 150px 1fr;

        .portrait {
            grid-area: p;
            border: 1px solid black;
        }

        .stats {
            grid-area: s;
            display: grid;
            grid-template: repeat(4, 1fr) / repeat(4, 1fr);

            .vibes,
            .tags {
                grid-column: 1 / 5;
            }

            .vibes {
                font-style: italic;
            }

            .tags {
                display: flex;
                flex-direction: row;
                align-items: center;
                button {
                    margin-left: auto;
                    max-width: 60px;
                }
            }
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
