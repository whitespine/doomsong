import skull from "$assets/icons/skull_white.png";

const DOOM = {
    id: "doomed",
    name: "DS.status.doomed",
    img: skull
}

export function setupStatuses() {
    CONFIG.statusEffects["doomed"] = DOOM;
}