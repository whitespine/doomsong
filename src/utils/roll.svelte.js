import roll_types from "./roll_types.json";

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

    // Send to chat immediately
    /**
     * @type {RollMessageData}
     */
    let flags = {

    };
    let message = await ChatMessage.create({
        rolls: [roll],
        speaker: speaker ?? ChatMessage.getSpeaker(),
        // Doomsong specific sauce
        [`flags.${game.system.id}`]: {
            type: "roll",
            roll_type,
            coin_result: 0,
            difficulty,
        },
    });

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
     * Construct a result table
     * @param {RawResultTable} raw_table 
     */
    constructor(raw_table) {
        /** @type {RawResultTable} */
        this.raw_table = raw_table; 

        // Also pre-compute some utility values
        /** @type {number | null} */
        this.max_over_key = null;
        for(let key of Object.keys(this.raw_table.results)) {
            let m = key.match(/(\d)\+? over/);
            if(!m) continue;
            let this_over = Number.parseInt(m[1]);
            this.max_over_key = Math.max(this_over, this.max_over_key ?? -1);
        }
    }

    /**
     * The key for an over value
     * @param {number} over
     * @returns {string}
     */
    _overKey(over) {
        return `${over} over`;
    }

    /** Get an over result based on params
     * 
     * @param {number} baseOver A number >= 1
     * @param {CoinResult} coinResult Doomcoin result
     * @returns {[string, ResultEntry]} The result key, and corresponding entry
     */
    _overFor(baseOver, coinResult) {
        // Handle edge cases first - Skull on a 1 over becomes equal
        const simResult = (key) => [key, this.raw_table.results[key] ?? this._defaultResult];
        if(baseOver == 1 && coinResult == -1) {
            return simResult("equal");
        }
        // Crest on an undefined or max over becomes a proper crest. Handle both cases by just adding one
        if(coinResult == 1 && (this.max_over_key == null || baseOver >= this.max_over_key)) {
            return simResult("crest");
        }

        // Otherwise, just descend looking for any specific over result until we hit zero, at which point we give up and give over
        if(this.max_over_key != null) {
        let over = baseOver + (coinResult ?? 0);
            while(over > 0) {
                let ots = this._overKey(over);
                if(this.raw_table.results[ots]) {
                    return simResult(ots);
                }
                over--;
            }
        }

        // Default case: give over result
        return simResult("over");
    }

    /** What we return if no entry is specified. Error case, but we want to be error tolerant
     * @returns {ResultEntry}
     */
    get _defaultResult() {
        return {
            label: "NULL",
            text: "No result is defined for this roll result!"
        }
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
        const simResult = (key) => [key, this.raw_table.results[key] ?? this._defaultResult];
        if(rollResult < difficulty) {
            if(coinResult == 1) {
                return simResult("equal");
            } else if (coinResult == -1) {
                return simResult("skull");
            } else {
                return simResult("under");
            }
        } else if(rollResult == difficulty) {
            if(coinResult == 1) {
                return this._overFor(1, 0); // Handle over 1 case. Pretend coin is 0 - it has been handled
            } else if (coinResult == -1) {
                return simResult("under");
            } else {
                return simResult("equal");
            }
        } else {
            return this._overFor(rollResult - difficulty, coinResult ?? 0);
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