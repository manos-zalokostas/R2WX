<script>
    import Wrapper from "$lib/client/component/Wrapper.svelte";
    import {blink, toolPack} from "$lib";
    import {PAGE, ROLE} from "$var";

</script>


<Wrapper ctx={PAGE.TOOLA} authLevel={ROLE.GLOB}>

    <article>
        {#each toolPack() as [key, name, path, role], i}
            <button class=" r2wx-shadowable-card">
                <a class="r2wx-hover" href={blink(path)}>
                    {name}
                </a>
            </button>
        {/each}
    </article>

</Wrapper>

<style>

    article {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-wrap: wrap;
        gap: 25px;

        button {
            text-transform: uppercase;
            color: var(--r2wx-color-black);
            padding: 25px;
            height: 225px;
            width: 300px;
            background: #ddd;


            &:hover {
                /*color: var(--r2wx-color-yellow);*/
                background: white;
            }

            a {
                text-decoration: none;
                padding: 3px;

                &:hover {
                    text-decoration: underline;
                    color: var(--r2wx-color-blue) !important;
                }
            }
        }
    }

</style>