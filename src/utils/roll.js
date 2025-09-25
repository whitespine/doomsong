
/**
 * @typedef
 */

/**
 * 
 * @param {*} param0 
 * @returns 
 */
export async function rollCheck({ roll_type = "standard", difficulty = 5, mode = "standard", bonus = 0, speaker = null }) {
    let formula = {
        hasty: `2d6kl1 + ${bonus}`,
        standard: `1d6 + ${bonus}`,
        focused: `2d6kh1 + ${bonus}`,
    }[mode];
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
            difficulty: difficulty,
        },
    });

    return {
        message,
    }
}