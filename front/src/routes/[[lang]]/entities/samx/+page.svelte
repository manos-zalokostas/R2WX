<script>
    import R2wxFormGeneric from "$lib/client/component/R2wxFormGeneric.svelte";
    import Wrapper from "$lib/client/component/Wrapper.svelte";
    import {FORM, PAGE, ROLE, TOOL} from "$var";
    import {apiPath, apiUrl, low} from "$lib";
    import ctx from "./ctx.js"

    const {entity, typ, lit} = ctx();
    console.log(" -- ENTITY -- ", {entity})

</script>

<Wrapper ctx={PAGE.SAMX} authLevel={ROLE.GLOB}>

    <R2wxFormGeneric ctx={{
        uri : {post: apiPath(entity)}
    }}>

    </R2wxFormGeneric>

</Wrapper>