import { SvelteApplicationMixin } from "../overrides/svelte_mixin.svelte";
import AbilitySheetComponent from "../components/sheets/items/AbilitySheet.svelte";
import GearSheetComponent from "../components/sheets/items/GearSheet.svelte";
import WeaponSheetComponent from "../components/sheets/items/WeaponSheet.svelte";
import ArmorSheetComponent from "../components/sheets/items/ArmorSheet.svelte";

export class DoomsongItemSheet extends foundry.applications.sheets.ItemSheetV2 {
    static DEFAULT_OPTIONS = {
        classes: ["doomsong", "item"],
        closeOnSubmit: false,
        submit: false,
        submitOnClose: false,
        submitOnChange: false,
        baseApplication: "ItemSheet",
        window: {
            resizable: true,
        }
    }

    async _prepareContext(options) {
        let context = await super._prepareContext(options);
        context.item = this.item;
        context.actor = this.item.actor; // Might be null!
        return context;
    }

    // Stolen from foundry, modified
    async editImage(attr) {
        const current = foundry.utils.getProperty(this.document._source, attr);
        const defaultArtwork = this.document.constructor.getDefaultArtwork?.(this.document._source) ?? {};
        const defaultImage = foundry.utils.getProperty(defaultArtwork, attr);
        // const fp = new FilePicker.implementation({ // v13
        const fp = new FilePicker({
            current,
            type: "image",
            redirectToRoot: defaultImage ? [defaultImage] : [],
            callback: path => this.item.update({"img": path}),
            position: {
                top: this.position.top + 40,
                left: this.position.left + 10
            }
        });
        await fp.browse();
    }
}

export class DoomsongAbilitySheet extends SvelteApplicationMixin(DoomsongItemSheet) {
    static DEFAULT_OPTIONS = {
        classes: ["ability"],
        svelte: {
            component: AbilitySheetComponent
        },
        position: {
            width: 600,
            height: "auto"
        }
    }
}

export class DoomsongGearSheet extends SvelteApplicationMixin(DoomsongItemSheet) {
    static DEFAULT_OPTIONS = {
        classes: ["gear"],
        svelte: {
            component: GearSheetComponent
        },
        position: {
            width: 400,
            height: "auto"
        }
    }
}

export class DoomsongArmorSheet extends SvelteApplicationMixin(DoomsongItemSheet) {
    static DEFAULT_OPTIONS = {
        classes: ["armor"],
        svelte: {
            component: ArmorSheetComponent
        },
        position: {
            width: 400,
            height: "auto"
        }
    }
}

export class DoomsongWeaponSheet extends SvelteApplicationMixin(DoomsongItemSheet) {
    static DEFAULT_OPTIONS = {
        classes: ["weapon"],
        svelte: {
            component: WeaponSheetComponent
        },
        position: {
            width: 400,
            height: "auto"
        }
    }
}