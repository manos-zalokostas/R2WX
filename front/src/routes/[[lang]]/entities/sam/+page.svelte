<script>
    import Wrapper from "$lib/client/component/Wrapper.svelte";
    import R2wxFieldsetInput from "$lib/client/component/R2wxFieldsetInput.svelte";
    import R2wxFormCustom from "$lib/client/component/R2wxFormCustom.svelte";
    import {FORM, PAGE, ROLE, TOOL} from "$var";
    import httpClient from "$lib/httpClient.js";
    import {apiPath, apiUrl, low} from "$lib";
    import {form} from "$store";
    import ctx from "./ctx.js"

    const {entity, typ, lit} = ctx();

    let [disabled] = $derived([
        [FORM.READ, FORM.DEL].includes($form.mode),
    ])
</script>

<Wrapper ctx={PAGE.SAM} authLevel={ROLE.GLOB}>

    <R2wxFormCustom ctx={{
        uri : {post: apiPath(entity, "multipart")}
    }}>

        <R2wxFieldsetInput id="name"/>
        <R2wxFieldsetInput id="number"/>
        <R2wxFieldsetInput id="float"/>
        <R2wxFieldsetInput id="boolean"/>

        <R2wxFieldsetInput id="file_def"/>

        <hr class="r2wx-area-defer"/>

        <R2wxFieldsetInput id="description"/>
        <R2wxFieldsetInput id="date"/>

        <R2wxFieldsetInput id="file"/>

        <hr class="r2wx-area-defer"/>

        <section class="r2wx-input-defer">
            <R2wxFieldsetInput id="files"/>
        </section>

    </R2wxFormCustom>

</Wrapper>