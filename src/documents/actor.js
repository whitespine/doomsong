
/**
 * Our custom class for Icon Actors
 */
export class DoomsongActor extends Actor {
    /**
     * Patch update to preserve arrays
     *
     * @param data
     *
     * @param options
     */
    async update(data, options = {}) {
        data = this.system.fullUpdateData(data);
        return super.update(data, options);
    }

    /* @override
     * This is overridden to pre-populate with slightly more sensible data,
     * such as nicer icons and default names, token dispositions, etc
     */
    async _preCreate(...[data, options, user]) {
        await super._preCreate(data, options, user);

        // Give a decent default icon
        // let img = data.img ?? defaultImage({ type: data.type, name: data.name });

        // Set default link status
        let actorLink = data.prototypeToken?.actorLink ?? (data.type === "player");

        let bar1 = data.prototypeToken?.bar1 ?? {
            attribute: "toughness",
        };
        let bar2 = data.prototypeToken?.bar2 ?? {
            attribute: "footing",
        };

        // Put in the basics
        this.updateSource({
            // img,
            prototypeToken: {
                actorLink,
                displayName: CONST.TOKEN_DISPLAY_MODES.HOVER,
                bar1,
                bar2
            },
        });
    }

}