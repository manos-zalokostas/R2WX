<script>
    /**
     * R2WX EXTENSION EXPERIMENT — GOOGLE GEMINI
     *
     * This multipart PUT flow was produced by Gemini after being
     * asked to study and reuse the existing R2WX infrastructure
     * to implement the missing multipart update path.
     *
     * Human-reviewed after generation.
     */
    import R2wxFormGeneric from "$lib/client/component/R2wxFormGeneric.svelte";
    import Wrapper from "$lib/client/component/Wrapper.svelte";
    import {page} from "$app/stores";
    import {PAGE, TOOL} from "$var";
    import {apiPath} from "$lib";
    import ctx from "../ctx.js";


    const {entity} = ctx();
    const id = $page.params.evt_id;


</script>

<Wrapper ctx={PAGE.SAM}>
    <R2wxFormGeneric ctx={{
        uri: { put: apiPath(entity, 'multipart', id) }
    }}/>
</Wrapper>