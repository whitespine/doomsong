


// 
/** Aggressively prune whitespace and newlines in a string
 * 
 * @param {string} text text
 * @returns {string} The trimmed string
 */
export function cleanup_paste(text) {
    return text.trim().replaceAll(/\s+/g, " ");
}


/** Creates an UpdateInput update callback that will auto-populate the move name if 
 * 
 * @param {Document} doc The document to update moves within
 * @param {string} path The path to the move object
 * @returns {(text: string) => Promise<void>} A callback to perform updates
 */
export function move_paste_handler(doc, path) {
    /** @type {(text: string) => Promise<void>} */
    return async (text) => {
        // Under normal circumstances, just update the move text as normal
        let name_path=`${path}.name`;
        let text_path=`${path}.text`;

        // Check for a leading string
        let lead = text.match(/.*?\./);
        let double_lead = `${lead[0]} ${lead[0]}`;
        if(lead && text.startsWith(double_lead)) {
            // Remove both, set name with it
            await doc.update({
                [name_path]: lead[0].replaceAll(".", "").trim(),
                [text_path]: text.replaceAll(double_lead, "")
            });
        } else {
            // Otherwise set normally
            await doc.update({
                [text_path]: text
            });
        }
    }
}