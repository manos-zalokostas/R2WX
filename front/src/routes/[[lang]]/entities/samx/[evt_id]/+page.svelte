<script>
    import Wrapper from "$lib/client/component/Wrapper.svelte";
    import R2wxFormGeneric from "$lib/client/component/R2wxFormGeneric.svelte";
    import {PAGE, TOOL} from "$var";
    import {apiPath} from "$lib";
    import ctx from "../ctx.js";
    import {page} from "$app/stores";

    const {entity, typ, lit} = ctx();

</script>

<Wrapper ctx={PAGE.SAMX}>

    <R2wxFormGeneric ctx={{
        uri: {
            all: apiPath(entity, $page.data.params.evt_id),
        }
    }}/>

</Wrapper>
