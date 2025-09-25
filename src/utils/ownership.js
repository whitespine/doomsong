

// Returns a list of _online_ users who have at least the given level of ownership of a document
export function onlineOwners(document, level = CONST.DOCUMENT_OWNERSHIP_LEVELS) {
    return owners(document, level).filter(u => u.active);
}

// Returns a list of users who have at least the given level of ownership of a document
export function owners(document, level = CONST.DOCUMENT_OWNERSHIP_LEVELS) {
    let ownership = document.ownership ?? { default: 0 };
    let result = [];
    for (let user of game.users.contents) {
        if (!user.active) continue; // Skip offline
        if (user.isGM || ((ownership[user.id] ?? ownership["default"] ?? 0) >= level)) {
            result.push(user);
        }
    }
    return result;
}