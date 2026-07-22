<script>
    import crest from "$assets/icons/crest.png";
    import skull from "$assets/icons/skull.png";
    import { fixClasses } from "../../utils/classes";
    let { value = 0, class: classes, ...restProps } = $props();
    // $inspect(classes);
    // $inspect(fixClasses("doomcoin unflipped", classes));
</script>

{#if value == 0}
    <a {...restProps} class={fixClasses("doomcoin unflipped", classes)}>
        <i class="fas fa-coin"></i>
    </a>
{:else if value == 1}
    <img
        class={fixClasses("doomcoin flipped", classes)}
        src={crest}
        alt="Crest"
        {...restProps}
    />
{:else if value == -1}
    <img
        class={fixClasses("doomcoin flipped", classes)}
        src={skull}
        alt="Skull"
        {...restProps}
    />
{/if}

<style lang="scss">
    .doomcoin {
        &.unflipped {
            cursor: pointer;
        }

        &.flipped {
            width: 1em;
            height: 1em;
        }
    }
</style>
