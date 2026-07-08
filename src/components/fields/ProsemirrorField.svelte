<script>
    import { resolveDotpath } from "../../utils/paths";

    let { doc, path, ...restProps } = $props();
    let content = $derived(resolveDotpath(doc, path));

    function save(e) {
        doc.update({ [path]: e.target.value });
    }
</script>

<!-- <div class="editor" {@attach editorAttachment}></div>-->
<prose-mirror
    value={content}
    onsave={save}
    onclose={close}
    collaborate
    data-document-uuid={doc.uuid}
    name={path}
    {...restProps}
></prose-mirror>

