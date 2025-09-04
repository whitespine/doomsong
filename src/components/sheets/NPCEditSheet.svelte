<script>
    import TraitTag from "../fields/TraitTag.svelte";
    import UpdateInput from "../fields/UpdateInput.svelte";
    import Die from "../rolls/Die.svelte";
    import { prevent } from "../../utils/handlers";
    let { context } = $props();
    let source = $derived(context.source);
    let actor = $derived(context.document);

    // Add a new basic move
    function addMove(act) {
        actor.update({
            [`system.moves.${act}.${foundry.utils.randomID()}`]: null, // Let the field autopopulate
        });
    }

    // Remove the specified move
    function deleteMove(act, move_id) {
        actor.update({
            [`system.moves.${act}.-=${move_id}`]: null,
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

<div class="npc-sheet" onsubmit={prevent}>
    <div class="header">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <img
            class="portrait"
            src={source.img}
            alt="potrait"
            onclick={() => context.app.editImage("img")}
        />
        <div class="stat-area">
            <div class="stat-grid">
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
                {@render field(
                    "max_footing",
                    "Max Footing",
                    "system.max_footing",
                )}
                {@render field("footing", "Footing", "system.footing")}
                {@render field(
                    "min_difficulty",
                    "Min Difficulty",
                    "system.min_difficulty",
                )}
            </div>

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
                {#if source.system.traits.length == 0}
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
                    {#if Object.keys(moves).length == 0}
                        <span
                            >Click the die to add a move. Otherwise, this
                            creature will be unable to do much in this act.</span
                        >
                    {/if}
                    {#each Object.entries(moves) as [move_id, move]}
                        <div class="move">
                            <UpdateInput
                                tag="input"
                                type="text"
                                doc={actor}
                                {source}
                                path={`system.moves.${act}.${move_id}.name`}
                            />
                            <UpdateInput
                                tag="textarea"
                                doc={actor}
                                {source}
                                path={`system.moves.${act}.${move_id}.text`}
                            />
                            <!-- svelte-ignore a11y_click_events_have_key_events -->
                            <!-- svelte-ignore a11y_no_static_element_interactions -->
                            <!-- svelte-ignore a11y_missing_attribute -->
                            <a
                                onclick={() => deleteMove(act, move_id)}
                                aria-label={`Delete move: ${move.name}`}
                            >
                                <i class="fas fa-trash"></i>
                            </a>
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>

<style lang="scss" module>
    .npc-sheet {
        .header {
            display: flex;
            flex-direction: row;

            .portrait {
                max-width: 200px;
                max-height: 200px;
                border: 1px solid black;
            }

            .stat-area {
                display: flex;
                flex-direction: column;

                .stat-grid {
                    display: grid;
                    grid-template: repeat(2, 1fr) / repeat(4, 1fr);

                    & > * {
                        margin: 5px;
                    }
                }

                .vibes {
                    font-style: italic;
                }

                .traits {
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

                    .move {
                        display: flex;
                        flex-direction: row;
                        align-items: center;

                        input {
                            width: 120px;
                            height: 2em;
                        }

                        textarea {
                            margin-left: 10px;
                            flex-grow: 1;
                            height: 2em;
                            resize: vertical;
                            min-height: 2em;
                        }
                    }

                    i {
                        padding: 0px 10px;
                    }
                }
            }
        }
    }
</style>
