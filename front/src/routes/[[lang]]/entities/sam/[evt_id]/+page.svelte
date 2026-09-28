<script>
    import Wrapper from "$lib/client/component/Wrapper.svelte";
    import R2wxFormGeneric from "$lib/client/component/R2wxFormGeneric.svelte";
    import {PAGE, TOOL} from "$var";
    import {apiPath} from "$lib";
    import ctx from "../ctx.js";

    const {entity, typ, lit} = ctx();

</script>

<Wrapper ctx={PAGE.SAM}>

    <R2wxFormGeneric blockEdit ctx={{
        api: {post: apiPath(entity, 'multipart')}
    }}/>

</Wrapper>
