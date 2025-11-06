# Doomsong RPG for FoundryVTT

An unofficial system implementation for the [Doomsong RPG](https://caesar.ink/viewproduct/5/doomsong-corebook), by Jack Cæsar / Caesar Ink.

This system is compatible with v13 only, as unfortunately v12's ui code was so painful I just did not want to deal with it.

## Recommended Modules

- Dice so Nice, for which there is a doomsong specific dice theme which can be found [here](https://foundryvtt.com/packages/doomsong-dice). Thank you snowkeep!
- Simple Calendar, for which I have implemented the first half of the doomsong expanded calendar! 
    - Once Foundry's calendar system is finalized we can hopefully have a more generic compatibility!
      Stay tuned.

## Attributions and Acknowledgements

This project would not be possible without the Cæsar Ink team themselves, 
who not only encouraged this fan work, but have been very permissive in what can be included 
and have even gone so far as to provide various assets so I didn't have to rip everything from the pdf myself.

Furthermore, I would like to thank
- The [FoundryVTT module Template](https://github.com/League-of-Foundry-Developers/FoundryVTT-Module-Template), 
  which has saved me time and time again from the ordeal of remembering how to make a foundry module.
- snowkeep, as previously mentioned, has made a lovely dice so nice module
  which really makes the doomcoin feel _right_.
- Artaey, who was instrumental in the early stages of making the system look much closer to the books feel.
- The lovely folks on the Foundy discord who answer my asinine development questions.

## Installing

The package will (soon) be available directly via the foundry vtt module installer, under the id `doomsong`.

Alternatively, it can be installed via the manifest url:

```
https://github.com/whitespine/doomsong/releases/latest/download/system.json
```

## Discussion and FAQ

There is a #doomsong-foundry channel in the official Cæsar Ink discord. 
Please ask any questions there! 
I will eventually populate this with more information


## Contributing

The system is still a work in progress, and there are undoubtedly dozens of ways of ways it could be improved!

I welcome merge requests, as well as bug reports via Github Issues or messages within the #. 
Given the scope of this project there is not yet any formal requirements or formats.

### Development

The project can be built and run locally via the following steps.
1. To link the developer build directory to the 

   `ln -s $(pwd)/dist /path/to/vtt/data/Data/systems/doomsong`
2. Perform an initial `npm ci` and `npm run build` to populate the dist directory.
   This will also need to be run to populate any asset files stored in the public directory,
   if you should ever change those.
3. Then, to run the vite development server, edit `vite.config.js` to match whatever port you 
   are running foundry on on your local machine. 
   While running, all code changes should be hot (or at least lukewarm) reloaded in the vite proxy server.
   

### Suggested contributions
!!! HIGH PRIORITY: !!!:
  - The remaining roll types presented in the core book
  - A guild sheet
  - More robust weapon tagging

!!! Appreciated but no rush: !!!
- [ ] Compendiums! NPCs and Abilities most welcome, though for now stick to the core book
- [ ] CSS Styling improvements.
- [ ] Localizations
- [ ] Fanmade rollable tables, though these should maybe be their own modules