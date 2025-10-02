import { injectReactive } from "../models/base.svelte";

/**
 * Inject reactivity into various core document fields
 */

const injects = [
    {
        target: User,
        keys: ["name"] // Color doesn't quite work because it is an extension of a subclass of Number. Confusing
    }, {
        target: Actor,
        keys: ["name", "img"]
    }
];

export function injectAllCoreDocuments() {
    for(let inject of injects) {
        const original_configure = inject.target.prototype._configure;
        inject.target.prototype._configure = function (options={}) {
            const original_this = this;
            original_configure.call(original_this, options);

            // Then do injects
            for(let key of inject.keys) {
                injectReactive(original_this, key);
            }
        }
    }
}