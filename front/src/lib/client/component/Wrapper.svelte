<script>
    import MainMenu from "$lib/client/component/MainMenu.svelte";
    import Breadcrump from "$lib/client/component/Breadcrump.svelte";
    import {page} from "$app/stores";
    import {ROLE} from "$var";
    import Authorized from "$lib/client/component/Authorized.svelte";

    let {
        ctx,
        children,
        authLevel = ROLE.READ,
    } = $props();
    const [title, path, role] = ctx;

</script>

<svelte:head>
    <title>R2WX | {$page.data.breadcrump?.[1]?.toUpperCase() || 'PAGE'}</title>
</svelte:head>


<div class="r2wx-main-content">

    {#if $page.data.profile}
        <div id="sg-nav">
            <MainMenu/>
        </div>
    {/if}

    <div id="sg-main">
        <div class="bcrump">
            <Breadcrump entries={$page.data.breadcrump}/>
            <h1>{title}</h1>
        </div>
        <Authorized level={authLevel}>
            <div class="sg-wrapper">
                {@render children?.()}
            </div>
        </Authorized>
    </div>

</div>


<style>
    h1 {
        text-align: right;
        text-transform: uppercase;
        color: var(--r2wx-color-blue);
    }

    .r2wx-main-content {
        display: flex;
        width: 100%;
        height: 100%;


        #sg-nav {
            flex-grow: 0;
            min-width: 325px;
            /*background: #ddd;*/
        }


        #sg-main {
            flex-grow: 1;
            padding: 0 25px;

            .sg-wrapper {
                padding: 15px 0 25px;
            }

            .bcrump {
                display: flex;
                justify-content: space-between;
                text-align: right;
                padding: 0 0 30px 0;
            }
        }

    }

</style>
