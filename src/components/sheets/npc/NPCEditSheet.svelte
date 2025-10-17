<script>
    import TraitTag from "../../fields/TraitTag.svelte";
    import UpdateInput from "../../fields/UpdateInput.svelte";
    import Die from "../../rolls/Die.svelte";
    import { stop } from "../../../utils/handlers";
    import Portrait from "../../fields/Portrait.svelte";
    import DeleteButton from "../../fields/DeleteButton.svelte";
    import ViewAbility from "../../items/ViewAbility.svelte";
    let { app, context } = $props();
    let actor = $derived(context.document);

    // Add a new basic move
    function addMove(act) {
        actor.update({
            [`system.moves.${act}.${foundry.utils.randomID()}`]: null, // Let the field autopopulate
        });
    }

    // Add a new blank ability
    function addAbility() {
        actor.createEmbeddedDocuments("Item", [
            { type: "ability", name: "New Ability" },
        ]);
    }

    // Remove the specified move
    function deleteMove(act, move_id) {
        actor.update({
            [`system.moves.${act}.-=${move_id}`]: null,
        });
    }
</script>

<div class="npc-sheet container" onsubmit={stop}>
    <button hidden disabled>Snake Eater</button>
    <div class="row">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <div class="col-3">
            <Portrait
                doc={actor}
                path="img"
                height="175px"
                callback={(img) => app.setImage(img)}
            />
        </div>
        <div class="col-9 container">
            {#snippet field(key, label, path)}
                <div class="col">
                    <label for={key}>{label}:</label>
                    <UpdateInput name={key} doc={actor} {path} type="text" />
                </div>
            {/snippet}
            <div class="row">
                {@render field("name", "Name", "name")}
                {@render field(
                    "max_toughness",
                    "Max Toughness",
                    "system.toughness.max",
                )}
                {@render field(
                    "toughness",
                    "Toughness",
                    "system.toughness.value",
                )}
                {@render field("protection", "Protection", "system.protection")}
            </div>
            <div class="row">
                {@render field(
                    "action_dice",
                    "Action Dice",
                    "system.base_action_dice",
                )}
                {@render field(
                    "max_footing",
                    "Max Footing",
                    "system.footing.max",
                )}
                {@render field("footing", "Footing", "system.footing.value")}
                {@render field(
                    "min_difficulty",
                    "Min Difficulty",
                    "system.min_difficulty",
                )}
            </div>

            <div class="row">
                <div class="col vibes">
                    <UpdateInput
                        name="vibes"
                        placeholder="put, some, descriptors, here"
                        doc={actor}
                        path="system.vibes"
                        type="text"
                    />
                </div>
            </div>
            <div class="row">
                <div class="col traits">
                    {#if actor.system.traits.length == 0}
                        Add a trait!
                    {:else}
                        {#each Object.keys(actor.system.traits) as trait_id}
                            <TraitTag
                                doc={actor}
                                path={`system.traits.${trait_id}`}
                            />
                        {/each}
                    {/if}
                    <button onclick={(e) => (stop(e), actor.promptAddTrait())}>
                        Add Trait
                    </button>
                </div>
            </div>
        </div>
        <div class="abilities row">
            <div class="col">
                {#if Object.keys(actor.system.abilities).length == 0}
                    <span>Try adding a new ability, if this npc has one</span>
                {/if}
                {#each actor.system.abilities as ability}
                    <ViewAbility {ability} />
                {/each}
                <button onclick={addAbility}>Add an Ability</button>
            </div>
        </div>
        {#each Object.entries(actor.system.moves) as [act, moves]}
            <div class="row act">
                <div class="col-1">
                    <Die
                        value={act}
                        style="width: 32px; height: 32px; cursor: pointer"
                        onclick={() => addMove(act)}
                        data-tooltip="Add a move to this act"
                    />
                </div>
                <div class="col-11 move-options">
                    {#if Object.keys(moves).length == 0}
                        <span
                            >Click the die to add a move. Otherwise, this
                            creature will be unable to do much in this act.</span
                        >
                    {/if}
                    {#each Object.entries(moves) as [move_id, move]}
                        <div class="move">
                            <UpdateInput
                                type="text"
                                doc={actor}
                                path={`system.moves.${act}.${move_id}.name`}
                            />
                            <UpdateInput
                                tag="textarea"
                                doc={actor}
                                path={`system.moves.${act}.${move_id}.text`}
                            />
                            <!-- svelte-ignore a11y_click_events_have_key_events -->
                            <!-- svelte-ignore a11y_no_static_element_interactions -->
                            <!-- svelte-ignore a11y_missing_attribute -->
                            <DeleteButton
                                callback={() => deleteMove(act, move_id)}
                                label={`Delete move: ${move.name}`}
                            />
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>

<style lang="scss" module>
    .npc-sheet {
        .traits,
        .vibes {
            padding-top: 10px;
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

        .abilities {
            display: flex;
            flex-direction: column;
        }

        .act {
            border: 1px solid black;
            margin: 5px 5px;

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
</style>
