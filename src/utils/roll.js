
/** An attempt to attack
 * @typedef {object} CheckParams
 * @property {("standard" | "corruption" | "navigate" | "attack")} roll_type What are we rolling
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