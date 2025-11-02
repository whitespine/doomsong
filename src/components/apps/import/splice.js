import one from "$assets/dice/1.png";
import two from "$assets/dice/2.png";
import three from "$assets/dice/3.png";
import four from "$assets/dice/4.png";
import five from "$assets/dice/5.png";
import six from "$assets/dice/6.png";
import { cleanup_whitespace, get_double } from "../../../utils/paste";

/** A special start token marker
 * @typedef {object} SpliceMarker
 * @property {string} key A special key to programatically identify this splice point
 * @property {string} [img] Path to an image icon 
 * @property {string} [label] A small text label. Used if img unset. One of them should definitely be set
 * @property {string} tooltip Tooltip to show on hover
 */

/** A special start token marker
 * @typedef {object} SpliceResult
 * @property {SpliceMarker} splice Whether this block is associated with a splice
 * @property {string} text The text of the splice
 */


/** 
 * @typedef {(splices: SpliceResult[]) => void} SpliceCallback
 */



/** @type {SpliceMarker} */
export const NULL_MARKER = {
    key: "null",
    tooltip: "This word is not marked as the start of any particular attribute on the import. Try clicking to cycle"
}

/**
 * @type {SpliceMarker[]}
 */
export const NPC_MARKERS = [
    {
        key: "name",
        tooltip: "Use as the npc's name",
        label: "NAME:"
    },
    {
        key: "trait",
        tooltip: "Add as an trait",
        label: "TRAIT:"
    },
    {
        key: "ability",
        tooltip: "Add as an ability. Try to include both ability labels, for automatic name deduction.",
        label: "ABILITY:"
    },
    ...[one, two, three, four, five, six].map((die_image, index) => ({
        key: `move_${index + 1}`,
        tooltip: `Add as an act ${index + 1} move. Try to include both move labels, for automatic name deduction.`,
        img: die_image
    })),
    {
        key: "omit",
        tooltip: "Just ignore this section",
        label: "OMIT:"
    },
];


/**
 * 
 * @param {Actor} npc 
 * @param {SpliceResult[]} results The incoming results
 */
export async function import_npc(npc, results) {
    let update = {};
    let traits = [];
    let abilities = [];
    let moves_by_act = {};
    for(let item of results) {
        if(!item.splice) continue;
        if(item.splice.key == "name") {
            update["name"] = cleanup_whitespace(item.text);
        } else if (item.splice.key == "trait") {
            traits.push(item.text);
        } else if (item.splice.key == "ability") {
            abilities.push(item.text);
        } else if (item.splice.key.startsWith("move_")) {
            let act = Number.parseInt(item.splice.key[5]);
            moves_by_act[act] ??= [];
            moves_by_act[act].push(item.text);
        }
    }

    // Convert traits
    update["system.traits"] = Object.fromEntries(traits.map(t => [foundry.utils.randomID(), cleanup_whitespace(t)]));

    // Convert moves
    for(let [act, moves] of Object.entries(moves_by_act)) {
        for(let move of moves) {
            let gd = get_double(move);
            update[`system.moves.${act}.${foundry.utils.randomID()}`] = {
                name: gd.double?.replace(".", "") ?? "New Move",
                text: gd.rest
            };
        }
    }

    // Apply base update
    await npc.update(update);

    // Convert abilities (to items)
    let new_items = abilities.map(a => {
        let gd = get_double(a);
        let name = gd.double ?? "New ability";
        let text = gd.rest
        return {
            name,
            type: "ability",
            system: {
                rank: 1,
                ranks: {
                    [foundry.utils.randomID()]: {
                        rank: 1,
                        text
                    }
                }
            }
        }
    });

    // Create items
    await npc.createEmbeddedDocuments("Item", new_items);
}