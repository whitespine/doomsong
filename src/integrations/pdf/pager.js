import config from "./config.json";

export async function initPdfPager() {
    const module_id = "pdf-pager";

    for(let [key, value] of Object.entries(config)) {
        if(key == "actorConfig" || key == "itemConfig") {
            // PDF Pager expects a string
            value = JSON.stringify(value);
        }
        await game.settings.set(module_id, key, value);
    }
}