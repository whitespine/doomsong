<script>
    import TraitTag from "../fields/TraitTag.svelte";
    import UpdateInput from "../fields/UpdateInput.svelte";
    import Die from "../rolls/Die.svelte";
    let { context } = $props();
    let source = $derived(context.source);
    let actor = $derived(context.document);

    // Add a new basic move
    function addMove(act) {
        actor.update({
            [`system.moves.${act}`]: actor.system.moves[act].concat(undefined), // Let the field autopopulate
        });
    }

    // Remove the specified move
    function deleteMove(act, move_index) {
        let new_move_array = [...actor.system.moves[act]];
        new_move_array.splice(move_index, 1);
        actor.update({
            [`system.moves.${act}`]: new_move_array,
        });
    }

    // Add a new tag
    function addTrait() {
        const callback = (form, prefix) => {
            let trait = form.elements.trait.value;
            let existing_traits = [...actor.system.traits];
            existing_traits.push(`${prefix}${trait}`);
            actor.update({
                "system.traits": existing_traits,
            });
        };
        new foundry.applications.api.DialogV2({
            window: { title: "Add a Tag" },
            content: `<input type="text" name="trait" autofocus></input>`,
            buttons: [
                {
                    action: "add",
                    label: "Add",
                    callback: (evt, button, dialog) =>
                        callback(button.form, ""),
                },
                {
                    action: "add_defining",
                    label: "Defining",
                    callback: (evt, button, dialog) =>
                        callback(button.form, "+"),
                },
                {
                    action: "add_super_defining",
                    label: "Epitome",
                    callback: (evt, button, dialog) =>
                        callback(button.form, "++"),
                },
            ],
        }).render({ force: true });
    }
</script>

<div class="npc-sheet">
    <div class="header">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <img
            class="portrait"
            src={source.img}
            alt="potrait"
            onclick={() => app.editImage("img")}
        />
        <div class="stats">
            {#snippet field(key, label, path)}
                <div>
                    <label for={key}>{label}:</label>
                    <UpdateInput
                        name={key}
                        {source}
                        doc={actor}
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
            {@render field(
                "action_dice",
                "Action Dice",
                "system.base_action_dice",
            )}
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
                data={source}
                doc={actor}
                path="system.vibes"
                type="text"
            />
            <div class="traits">
                {#if source.system.tags.length == 0}
                    Add a trait!
                {:else}
                    {#each source.system.traits as trait, index}
                        <TraitTag
                            doc={actor}
                            {source}
                            path={`system.traits.${index}`}
                        />
                    {/each}
                {/if}
                <button onclick={addTrait}>Add Trait</button>
            </div>
        </div>
    </div>
    <div class="moves">
        {#each Object.entries(source.system.moves) as [act, moves]}
            <div class="act-body">
                <Die
                    value={act}
                    style="width: 32px; height: 32px; cursor: pointer"
                    onclick={() => addMove(act)}
                    data-tooltip="Add a move to this act"
                />
                <div class="move-options">
                    {#if moves.length == 0}
                        <span
                            >Click the die to add a move. Otherwise, this
                            creature will be unable to do much in this act.</span
                        >
                    {/if}
                    {#each moves as move, move_index}
                        <div class="move">
                            <UpdateInput
                                tag="input"
                                type="text"
                                doc={actor}
                                {source}
                                path={`system.moves.${act}.${move_index}.name`}
                            />
                            <UpdateInput
                                tag="textarea"
                                doc={actor}
                                {source}
                                path={`system.moves.${act}.${move_index}.text`}
                                style="resize: vertical"
                            />
                            <!-- svelte-ignore a11y_click_events_have_key_events -->
                            <!-- svelte-ignore a11y_no_static_element_interactions -->
                            <!-- svelte-ignore a11y_missing_attribute -->
                            <a
                                onclick={() => deleteMove(act, move_index)}
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
        .header {
            display: flex;
            flex-direction: row;

            .portrait {
                max-width: 150px;
                max-height: 150px;
                border: 1px solid black;
            }

            .stats {
                display: grid;
                grid-template: repeat(4, 1fr) / repeat(4, 1fr);

                & > * {
                    margin: 5px;
                }

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
                        max-width: 80px;
                    }
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
                border-bottom: solid black 1px;

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
                            width: 120px;
                        }

                        textarea {
                            margin-left: 10px;
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
