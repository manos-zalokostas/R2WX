<script>
    import MainNavButtonList from "$lib/client/component/MainNavButtonList.svelte";
    import MainNavButton from "$lib/client/component/MainNavButton.svelte";
    import Authorized from "$lib/client/component/Authorized.svelte";
    import {PAGE, ROLE} from "$var";
    import {toolPack} from "$lib";
    import {SVGI} from "$lib/SVGIcon.js";

</script>


<MainNavButton ctx={PAGE.STLAT} icon={SVGI.HIST}/>

<Authorized>
    <MainNavButton ctx={PAGE.TOOLA} icon={SVGI.OVER}/>
    <MainNavButtonList ctx={PAGE.STCRE} icon={SVGI.FLUP}>
        {#each toolPack() as [key, name, path]}
            <button>
                <a href={path}>{name}</a>
            </button>
        {/each}
    </MainNavButtonList>
</Authorized>


<MainNavButton ctx={PAGE.STSER} icon={SVGI.SERC}/>

<style>
    button {

        a {
            color: var(--r2wx-color-yellow);
            text-align: left;
            text-decoration: none;
            text-transform: uppercase;
            padding: 4px 0;

            &:hover {
                color: var(--r2wx-color-blue);
            }
        }

    }
</style>