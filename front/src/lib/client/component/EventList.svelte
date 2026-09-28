<script>
    import Authorized from "$lib/client/component/Authorized.svelte";
    import TooltipDelete from "$lib/client/component/TooltipDelete.svelte";
    import SVG from "$lib/client/component/SVG.svelte";
    import {page} from "$app/stores";
    import {SVGI} from "$lib/SVGIcon.js";
    import {blink, upp} from "$lib";
    import {PAGE} from "$var";
    import {apiUrl} from "$lib";
    import {low} from "$lib";

    const {list, hidden} = $props();
    const _dt = x => +x.split('T').shift().split('-').join('')

    // const d = $page.data;
    // debugger


</script>


{#each list as o, i}
    {@const tool = o.tool || $page.data.params.tool_id}
    <article class="sg-card r2-indexable {hidden ? 'r2wx-nodisplay' : ''}"
             data-name={o.name}
             data-date={_dt(o.created)}>

        <details>

            <summary>

                <div class="r2wx-left-side">

                    <Authorized>

                        <TooltipDelete url={apiUrl(low(tool), 'multipart', o.id)}/>

                    </Authorized>

                    <h4>
                        <strong>{o.name}</strong>
                        {#if o.tool}
                            <small class={o.file ?? 'ode-toolx'}>{PAGE[o.tool][0]}</small>
                        {/if}
                        <span class="r2wx-rotate-270">
                        <SVG icon={SVGI.BACK} color="white"/>
                    </span>
                    </h4>


                </div>


                <a href={blink('entities', low(tool), o.id)}>
                    <span class="r2wx-rotate-180">
                        <SVG icon={SVGI.BACK} color="yellow"/>
                    </span>
                </a>

            </summary>

            <p>{o.description}</p>

        </details>

        <footer>
            {new Date(o.created).toUTCString()}
        </footer>

    </article>
{/each}


<style>

    .r2wx-left-side {
        display: flex;
        align-items: baseline;
        justify-content: space-around;
        gap: 10px;
    }


    article {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex-wrap: wrap;
        margin: 10px;
        padding: 10px 10px 0;
        border-bottom: 1px solid #ddd;

        details {


            summary {
                display: flex;
                justify-content: space-between;

                h4 {
                    display: flex;
                    gap: 25px;
                    text-transform: capitalize;

                    strong {
                        font-size: large;
                        color: white;
                        text-transform: uppercase;
                    }

                    small {
                        padding: 2px 6px;
                        border-radius: 5px;
                        border: 1px solid #bbb;
                        background: var(--r2wx-color-yellow);

                        &.ode-toolx {
                            background: limegreen;
                        }
                    }

                }

                a {
                    max-height: 32px;
                    font-size: x-large;
                    color: var(--r2wx-color-black);
                }
            }

            p {
                color: var(--r2wx-color-grey);
                padding: 5px 10px;
                min-height: 75px;
                border-top: 2px solid #ccc;
                background: var(--r2wx-color-blue-dark);
            }
        }

        footer {
            color: var(--r2wx-color-grey);
            text-align: right;
        }
    }


</style>