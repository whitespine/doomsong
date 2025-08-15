// Use this in components to track targeted tokens
export let targeted_tokens = $state([]);

Hooks.on("targetToken", (user, token, targeted) => {
    if(game.user == user) {
        if(targeted) {
            targeted_tokens.push(token);
        } else {
            targeted_tokens.splice(targeted_tokens.indexOf(token), 1);
        }
    }
});