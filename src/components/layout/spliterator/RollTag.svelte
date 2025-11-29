<script>
    import { stop } from "../../../utils/handlers"
    import { resultTables, FALLBACK_RESULT_TABLE } from "../../../utils/roll.svelte"
    import { RollerApp } from "../../../apps/roll_app.svelte";
    /**
     * @type {({
     *  text: string,
     *  actor: Actor,
     *  roll_type: string,
     *  bonus: number
     * })}
     */
    let { text, actor, roll_type, bonus } = $props();

    let fixed_roll_type = $derived.by(() => {
        let base = roll_type.trim().toLocaleLowerCase()
        if(base == "attack") {
            return "attack_b";
        }
        return base;
    });

    function onclick(e) {
        stop(e);
        RollerApp.prompt(actor, {
            roll: {
                roll_type: fixed_roll_type,
                preset_choices: {
                    extras: bonus
                }
                // TODO: more pre-sets based on tags or something
            }
        });
    }
</script>

<button onclick={onclick}> {text} </button>

<style lang="scss"> 
    button {
        display: inline;
        padding: 0px 4px;
    }
</style>
