<script>
    import Wrapper from "$lib/client/component/Wrapper.svelte";
    import R2wxSearch from "$lib/client/component/R2wxSearch.svelte";
    import Badge from "$lib/client/component/Badge.svelte";
    import {page} from "$app/stores";
    import {PAGE, TOOL} from "$var";
    import {toolPack} from "$lib";

    const {children} = $props()

    const entities = toolPack();

    const _toolName = () => {
        return entities.find(
            ([key, name, path]) => (key === $page.data.params.tool_id)
        )?.[1]
    }

</script>


<Wrapper ctx={PAGE.STSER}>

    <section class="r2-search-ctrl">

        <R2wxSearch {...{
            title: 'search group',
            path: "events/search",
            list: entities
        }}/>

        {#if $page.data.params.tool_id}

            <Badge name={_toolName()} link="/events/search"/>

        {/if}

    </section>

    {#if children}
        {@render children()}
    {/if}

</Wrapper>


<style>

    .r2-search-ctrl {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;
    }


    section {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
    }

</style>