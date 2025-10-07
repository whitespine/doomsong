import { ItemModel } from "./item.svelte";

const fields = foundry.data.fields;

export class AbilityModel extends ItemModel {
    // Some schema elements are consistent across all actor types. Define them here
    static defineSchema() {
        return {
            ...super.defineSchema(),
            // Basic item info
            rank: new fields.NumberField({ nullable: false, initial: 1, integer: true, min: 1 }), // Abilities start at level 1. Just correct based on index

            // Keyed with random ids, basically
            ranks: new fields.TypedObjectField(new fields.SchemaField({
                rank: new fields.NumberField({ nullable: false, initial: 1, min: 1, integer: true }),
                text: new fields.StringField({ nullable: false })
            }), {
                nullable: false,
                initial: {
                    [foundry.utils.randomID()]: {
                        rank: 1,
                        text: "Level 1 Text"
                    }
                }
            }),

            // Where in the book is it
            page: new fields.StringField({ nullable: false, initial: "DS:???" }),
        };
    }

    // Easier to render form of level contents. Rank keys are injected as _id, but its just an array of objects sorted by rank
    sorted_ranks = $derived.by(() => {
        let levels = Array.from(Object.entries(this.ranks));
        let levels_with_ids = levels.map(([_id, body]) => ({
            _id,
            ...body
        }));
        // Sort by ranks
        levels_with_ids.sort((a, b) => a.rank - b.rank)
        return levels_with_ids;
    });

    // As sorted_ranks, but only the unlocked ones
    unlocked_ranks = $derived(this.sorted_ranks.filter(r => r.rank <= this.rank))
}
