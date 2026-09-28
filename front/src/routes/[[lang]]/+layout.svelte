<script>
    import "w3-css";
    import '/src/styles.scss';
    import '/node_modules/font-awesome/css/font-awesome.min.css'

    import Breadcrump from "$lib/client/component/Breadcrump.svelte";
    import UserDetail from "$lib/client/component/UserDetail.svelte";
    import Loadable from "$lib/client/component/Loadable.svelte";
    import Alert from "$lib/client/component/Alert.svelte";
    import {page} from "$app/stores";
    import {SVGI} from "$lib/SVGIcon.js";
    import SVG from "$lib/client/component/SVG.svelte";
    import UserExit from "$lib/client/component/UserExit.svelte";

    let {children} = $props();

    const p = $page.data;
    const SAM = {
        "user": {
            "id": 3,
            "preferred_user": "username",
            "given_name": "username",
            "email": "user@example.com",
            "role": "GLOB"
        },
        "access": null
    }

</script>

<article>

    <header class="r2wx-layout-top">
        <div class="sg-project-info">
            <img src="/image/logo.png" alt="r2wx default logo"/>
            <strong> R2WX | Road to Webbox</strong>
        </div>
        <div class="sg-user-section">
            <UserDetail user={$page.data.profile.user}/>
            <UserExit/>
        </div>
    </header>


    <main>
        {@render children?.()}
    </main>

    <Alert mins={0.2}/>
    <Loadable/>

</article>


<style>

    .r2wx-layout-top {
        display: flex;
        justify-content: space-between;
        padding: 10px 6px;
        background: var(--r2wx-color-black);

        .sg-project-info {
            img {
                margin: 5px 10px;
                width: 175px;
            }

            strong {
                text-transform: uppercase;
                color: var(--r2wx-color-blue);
            }

        }

        .sg-user-section {
            display: flex;
        }
    }


    main {
        display: flex;
        flex-direction: column;
        width: calc(100vw - 20px);
        height: calc(100vh - 175px);
        margin: 10px auto auto 0;
        padding: 15px 10px 25px;
    }

</style>

