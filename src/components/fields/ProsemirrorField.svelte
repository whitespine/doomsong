<script>
    import { onMount, onDestroy } from "svelte";
    import {resolveDotpath} from "../../utils/paths";
    let anchor;


    // By the way: this doesn't work

    let { document, path } = $props();
    let content = $derived(resolveDotpath(document, path));

    onMount(async () => {
        console.error(editor);
    });


	const editorAttachment = (element) => {
        setTimeout(() => {
            let editorPromise = TextEditor.implementation.create(
                {
                    engine: "prosemirror",
                    target: element,
                    document,
                    fieldName: path
                },
                content,
            );
        }, 100);

		return () => {
			console.log('TODO: cleaning up editor');
		};
	};
</script>

<div class="editor" {@attach editorAttachment}></div>
