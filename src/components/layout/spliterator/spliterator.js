import RollTag from "./RollTag.svelte";
import NullTag from "./NullTag.svelte";

// Just something we never expect to see in text
const SEPARATOR = "▽⋢⼒⊟";

/**
 * A unit that turns text into component-izable tokens
 * @typedef {object} Spliterator
 * @property {RegExp} regex A regex to apply
 * @property {(match_groups: string[]) => SpliterateResult} callback Callback to call on regex matches
 * })}
 */

/**
 * Result of a mixer
 * @typedef {object} SpliterateResult
 * @property {Component} component The component to instantiate
 * @property {object} props Props to pass the component
 * })}
 */

/** Spliterates
 * 
 * @param {string} text 
 * @param {Spliterator[]} spliterators 
 * @returns {Array<SpliterateResult>} result after calling all mixers. Even plain strings can be just a a NullTag
 */
export function componentize(text, spliterators) {
    if (spliterators.length == 0) {
        return [{
            component: NullTag,
            props: { text }
        }];
    }
    let current = spliterators[0];
    let global = RegExp(current.regex.source, "g")
    let intermittent = text.replaceAll(global, (target) => {
        return `${SEPARATOR}${target}${SEPARATOR}`;
    });
    let tokens = intermittent.split(SEPARATOR);
    let result = [];
    for (let i = 0; i < tokens.length; i++) {
        if (i % 2 == 0) {
            // Recurse on unmatched text
            let sub_results = componentize(tokens[i], spliterators.slice(1));
            result.push(...sub_results);
        } else {
            // Create spliterator results on 
            let match = tokens[i].match(current.regex)
            result.push(current.callback(match));
        }
    }
    return result;
}


/** @return {Spliterator} */
export function roll_spliterator(actor) {
    return {
        regex: /\[(attack|impair|corruption|fear),?\s*([+-]\d+)\]/,
        callback: (match) => {
            return {
                component: RollTag,
                props: {
                    text: match[0],
                    actor,
                    roll_type: match[1],
                    bonus: Number.parseInt(match[2])
                }
            };
        }
    }
}