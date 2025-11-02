import { SvelteApplicationMixin } from "../overrides/svelte_mixin.svelte";
import { NPC_MARKERS, NULL_MARKER } from "../components/apps/import/splice";
import ImportAppComponent from "../components/apps/import/ImportApp.svelte";

export class ImportApp extends SvelteApplicationMixin(foundry.applications.api.ApplicationV2) {
    static DEFAULT_OPTIONS = {
        classes: ["doomsong"],
        svelte: {
            component: ImportAppComponent,
        }
    }

    constructor(target, options = {}) {
        // Todo: handler other types 
        let type;
        let markers;
        if(target instanceof Actor) {
            type = "an npc";
            markers = NPC_MARKERS;
        } else {
            throw new Error(`Invalid target type: ${target?.constructor?.name}`);
        }
        options.window ??= {};
        options.window.title ??= `Importing to ${target.name}`;

        options.svelte ??= {};
        options.svelte.props = {
            type,
            marker_options: markers
        };
        
        super(options);
    }
}