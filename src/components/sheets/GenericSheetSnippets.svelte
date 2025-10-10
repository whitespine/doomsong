<script module>
    import UpdateCheckbox from "../fields/UpdateCheckbox.svelte";
    import UpdateInput from "../fields/UpdateInput.svelte";
    import UpdateSelect from "../fields/UpdateSelect.svelte";

    export { griddedTextField, griddedTextArea, griddedSelect, griddedCheckbox };

    let ratio_a = 4;
    let ratio_b = 12 - ratio_a;
</script>

{#snippet griddedTextField(doc, label, path)}
    <div class="row">
        <div class="col-{ratio_a}">
            <label for={label}>{label}</label>
        </div>
        <div class="col-{ratio_b}">
            <UpdateInput name={label} {doc} {path} type="text" />
        </div>
    </div>
{/snippet}

{#snippet griddedTextArea(doc, label, path)}
    <div class="row">
        <div class="col-{ratio_a}">
            <label for={label}>{label}</label>
        </div>
        <div class="col-{ratio_b}">
            <UpdateInput name={label} {doc} {path} tag="textarea" />
        </div>
    </div>
{/snippet}

{#snippet griddedSelect(doc, label, path, options)}
    <div class="row">
        <div class="col-{ratio_a}">
            <label for={label}>{label}</label>
        </div>
        <div class="col-{ratio_b}">
            <UpdateSelect name={label} {doc} {path} {options} />
        </div>
    </div>
{/snippet}

{#snippet griddedCheckbox(doc, label, path)}
    <div class="row">
        <div class="col-{ratio_a}">
            <label for={label}>{label}</label>
        </div>
        <div class="col-{ratio_b}">
            <UpdateCheckbox name={label} {doc} {path} {options} />
        </div>
    </div>
{/snippet}

<style lang="scss">
    .row {
        margin-top: 2px;
        margin-bottom: 2px;
    }
    label {
        font-size: larger;
    }
</style>