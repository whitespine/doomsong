import roll_types from "./roll_types.json";
import {sleep} from "./time";

/** An attempt to attack
 * @typedef {object} CheckParams
 * @property {string} roll_type What result table id are we rolling on
 * @property {string} formula The formula for the roll
 * @property {number} difficulty The difficulty of the roll
 * @property {AttackMetadata} [attack] Attack metadata, in case it is an attack
 */

/**
 * 
 * @param {("standard" | "hasty" | "focused")} roll_type The type of roll
 * @param {number} bonus The flat bonus
 */
export function formulaFor(roll_type, bonus) {
    return {
        hasty: `2d6kl1 + ${bonus}`,
        focused: `2d6kh1 + ${bonus}`,
    }[roll_type] || `1d6 + ${bonus}`; // default standard
}

/**
 * 
 * @param {CheckParams} check_details 
 * @returns 
 */
export async function rollCheck(check_details) {
    let { roll_type = "standard", difficulty = 5, formula, speaker = null } = check_details;
    let roll = await new Roll(formula).roll();

    // Send to chat immediately. 
    /**
     * @type {RollMessageData}
     */
    let flags = {
        type: "roll",
        roll_type,
        coin_result: 0,
        difficulty,
    };
    let message = await ChatMessage.create({
        rolls: [roll],
        speaker: speaker ?? ChatMessage.getSpeaker(),
        // Doomsong specific sauce
        [`flags.${game.system.id}`]: flags
    });

    // Provide suspense
    await suspense(roll);

    return {
        message,
        roll // technically embedded in message
    };
}


/**
 * A key corresponding to a result. Numbers are synonymous with "over", but will use a specific result table entry 
 * if the result table has an entry for that number (to support attack tables, or similar)
 * @typedef {"skull" | "under" | "equal" | "over" | "crest" | number} ResultKey
 */

/**
 * Possible coin results. -1 is Skull, 1 is Crest, 0/null are unflipped
 * @typedef {(-1 | 0 | 1 | null)} CoinResult
 */

/** A roll result table
 * @typedef {object} RawResultTable
 * @property {string} id The id for this roll type
 * @property {string} label The human friendly string for this roll type
 * @property {string} [tooltip] A more in depth, lore-esque description of this roll
 * @property {number} [default_difficult] The default difficulty of this roll, before rolling. TODO: Make this a function? For Death e.x.
 * @property {string} [difficulty_modifiers] A string describing conditions in which you should use alternative difficulty. e.x. death
 * @property {({[key: ResultKey]: ResultEntry})} results A table of results
 */

/**
 * Wrapper class on a result table for providing better roll results
 */
export class ResultTable {
    /** 
     * The over number with the highest value. If null, no X over's defined
     * We DO NOT assume all over keys below this are defined - if in doubt, take the closest value that is lower
     * We DO assume that at if any `X over` are defined, then 1 over MUST be defined. This is validated in the constructor
     * @type {number | null} 
     */
    #max_over = null;

    /** @type {({[key: number]: ResultEntry})} */
    #over_entries = {};

    /**
     * Construct a result table
     * @param {RawResultTable} raw_table 
     */
    constructor(raw_table) {
        /** @type {RawResultTable} */
        this.raw_table = raw_table; 

        // Also pre-compute some utility values
        for(let [key, entry] of Object.entries(this.raw_table.results)) {
            let kto = ResultTable.#keyToOver(key);
            if(kto) {
                this.#max_over = Math.max(kto, this.#max_over ?? -1);
                this.#over_entries[kto] = entry;
            }
        }

        // Validate
        if(this.#max_over !== null && this.#over_entries[1] === undefined) {
            throw new TypeError("When providing \"X over\" entries, you must at least define 1 over");
        }
    }

    /**
     * The key for an over value
     * @param {number} over
     * @returns {string}
     */
    static #overToKey(over) {
        return `${over} over`;
    }

    /**
     * The over value for a key
     * @param {string} key
     * @returns {number | null} Null if not a proper over key
     */
    static #keyToOver(key) {
        let m = key.match(/(\d)\+? over/);
        if(!m) return null;
        return Number.parseInt(m[1]);
    }

    /** For a given key, give a [key, resultEntry] pair
     * 
     * @param {string} key The key.
     * @returns {[string, ResultEntry]} A properly formatted entry for the given key. Returns a default result if none defined
     */
    resultEntry(key) {
        return [key, this.raw_table.results[key] ?? ResultTable.#defaultResult(key)];
    }

    /** 
     * @type {ResultEntry}
     */
    static #defaultResult(key) {
        return {
            label: "NULL",
            text: `No result is defined for roll result ${key}!`
        };
    }

    /**
     * @param {string} resultKey  
     * @returns {({
     *  "above": [string, ResultEntry] | null,
     *  "below": [string, ResultEntry] | null
     * })} The nearest neighbors to this result key
     */
    neighborEntries(resultKey) {
        return {
            above: this.crest(resultKey),
            below: this.skull(resultKey)
        };
    }

    /**
     * Bump up a result as though it had been hit by a crest
     * @param {string} resultKey The existing result key
     * @returns {[string, ResultEntry] | null} The result entry for the key increased by one step. If impossible (already a crest), return null
     */
    crest(resultKey) {
        ResultTable.#validateKey(resultKey);
        if(resultKey == "skull") return this.resultEntry("under"); // Not really possible but I guess it makes sense
        if(resultKey == "under") return this.resultEntry("equal"); 
        if(resultKey == "equal") {
            if(this.#max_over === null) {
                return this.resultEntry("over");
            } else {
                return this.resultEntry("1 over"); // Guaranteed to exist
            }
        }
        if(resultKey.includes("over")) {
            if(this.#max_over) {
                // Get the next highest
                let over = ResultTable.#keyToOver(resultKey) + 1;
                while(over <= this.#max_over) {
                    if(this.#over_entries[over]) return this.resultEntry(ResultTable.#overToKey(over));
                    over += 1;
                }
                // We went beyond
                return this.resultEntry("crest");
            } else {
                return this.resultEntry("crest");
            }
        }
        if(resultKey == "crest") return null; // Not possible to go higher
    }

    /**
     * Drop down a result as though it had been hit by a skull
     * @param {string} resultKey The existing result key
     * @returns {[string, ResultEntry] | null} The result entry for the key decreased by one step. If impossible (already a crest), return null
     */
    skull(resultKey) {
        ResultTable.#validateKey(resultKey);
        if(resultKey == "skull") return null; // Not possible to go lower
        if(resultKey == "under") return this.resultEntry("skull"); 
        if(resultKey == "equal") return this.resultEntry("under");
        if(resultKey.includes("over")) {
            if(this.#max_over == null) {
                return this.resultEntry("equal");
            } else {
                let over = ResultTable.#keyToOver(resultKey);
                // Get the next lowest
                while(over >= 2) {
                    over -= 1;
                    if(this.#over_entries[over]) return this.resultEntry(ResultTable.#overToKey(over));
                }
                // We went beyond. Drop to equal
                return this.resultEntry("equal");
            }
        }
        if(resultKey == "crest") {
            // return the highest over, or just over. Weird edge case, but whatever
            if(this.#max_over) {
                return this.resultEntry(ResultTable.#overToKey(this.#max_over))
            } else {
                return this.resultEntry("over");
            }
        }
    }

    static #VALID_KEYS = new Set(["skull", "under", "equal", "over", "crest"]);
    /**
     * Validate a key is valid
     * @param {string} resultKey A potential key
     */
    static #validateKey(resultKey) {
        if(ResultTable.#VALID_KEYS.has(resultKey) || ResultTable.#keyToOver(resultKey)) return;
        throw new TypeError(`Invalid result table key ${resultKey}`);
    }

    /**
     * Get the result from this table based on roll + coin result.
     * If over, combines the closest over result (if numeric over results specified) or uses the base over result if no numeric over results specified
     * @param {number} rollResult 
     * @param {number} difficulty 
     * @param {CoinResult} coinResult The current flipped coin result
     * @returns {[string, ResultEntry]} The result key and corresponding entry
     */
    resultFor(rollResult, difficulty, coinResult=null) {
        console.error("WAWA");
        let result;
        if(rollResult < difficulty) {
            result = "under";
        } else if(rollResult == difficulty) {
            result = "equal"
        } else {
            result = `${rollResult - difficulty} over`;
        }

        if(coinResult == 1) {
            return this.crest(result) ?? this.resultEntry(result);
        } else if(coinResult == -1) {
            return this.skull(result) ?? this.resultEntry(result);
        } else {
            return this.resultEntry(result);
        }
    }

    // Wrapping getters

    /**
     * Straightforward table of result entries
     */
    get results() {
        return this.raw_table.results;
    }

    /**
     * @returns {string}
     */
    get label() {
        return this.raw_table.label;
    }

    /**
     * @returns {string | null}
     */
    get tooltip() {
        return this.raw_table.tooltip || null;
    }

    /**
     * @returns {number} The DC
     */
    get defaultDifficulty() {
        return this.raw_table.default_difficult ?? 5;
    }
}

/** A roll result table entry
 * @typedef {object} ResultEntry
 * @property {string} label The main label for this result. Just a few words at most
 * @property {string} text The full text of this roll result
 * @property {Consequence[]} [penalties] Bad things that happen if you roll this
 * @property {Consequence[]} [target_penalties] Bad things that happen _to your target_ if you roll this
 */

/** Consequences
 * @typedef {object} Consequence
 * @property {string} label The text to show for the consequence
 * @property {string} [toughness] Delta of toughness to apply
 * @property {string} [footing] Delta of footing to apply
 * @property {string} [resist_death] Whether the target should resist death
 * @property {string} [injury] The name of an injury to add
 * @property {string} [condition] The name of an condition to add
 */

let result_tables = $state({});

/**
 * Populates result tables from embedded json and, eventually, foundry roll tables etc
 */
function populateResultTables() {
    let tables = {};
    for(let raw of roll_types) {
        tables[raw.id] = new ResultTable(raw);
    }
    // TODO: read from foundry roll tables or something
    result_tables = tables;
}

// Populate on startup
Hooks.on("ready", populateResultTables);

/**
 * @returns {({[key: string]: ResultTable})}
 */
export function resultTables() {
    // External getter for state
    return result_tables;
}

export const FALLBACK_RESULT_TABLE = new ResultTable(roll_types[0]); // Convenient to have as  afallback

/** Our union type for all custom messages
 * @typedef {RollMessageData} DoomsongMessageData
 */

/** Our type for specifically a generic roll message
 * @typedef {object} RollMessageData
 * @property {"roll"} type The text to show for the consequence
 * @property {string} string Id of the result table to pull results from. Fallback to standard if not found
 * @property {CoinResult} [coin_result] The coin result, if the coin has been flipped
 * @property {number} difficulty The difficulty it was rolled against
 */

/**
 * Add a bit of suspense to your roll. This will either resolve via dice-so-nice, if enabled, or
 * if the settings have a configured dice delay use that as a timer instead.
 * If no delay is set, will resolve "immediately" via whatever your configured foundry roll mechanisms are
 * @param {Roll} roll An unresolved roll
 * @returns {Roll} The roll you give it
 */
export async function suspense(roll) {
    // Moves the result up or down by one
    if(game.dice3d) {
        // Use dicesonice
        await game.dice3d.showForRoll(roll, game.user, true)
    } else {
        // TODO: Have some sort of timer setting as an else if condition
        await sleep(1000);
    }

    // TODO: add options for broadcasting this to other players
    return roll;
}