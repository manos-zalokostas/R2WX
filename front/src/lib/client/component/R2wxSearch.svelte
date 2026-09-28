<script>
    import Collapsable from "$lib/client/component/Collapsable.svelte";
    import {goto} from "$app/navigation";
    import {blink, pathify} from "$lib";
    import {ui} from "$store";

    let {title = 'title', path = '/path', list} = $props();

    const onclick = evt => {
        evt.preventDefault();
        $ui.searchToolDialogOpen = !$ui.searchToolDialogOpen
        goto(evt.target.href);
    }


</script>


<Collapsable name={title}>

    <div class="r2wx-filter">

        <div class="r2wx-filter-content ">

            <div class="r2wx-filter-list w3-bar-block ">

                <div class="r2wx-list-entries">
                    {#each list as [key, name], i (key)}
                        {@const href = blink(path, key)}
                        <a {href} class="w3-bar-item" {onclick}>
                            {name}
                        </a>
                    {/each}
                </div>

            </div>

        </div>

    </div>

</Collapsable>

<style>
    .r2wx-filter {

        .r2wx-filter-content {
            position: relative;

            .r2wx-filter-list {
                position: absolute;
                z-index: 10;
                top: 15px;
                color: white;
                font-size: small;
                background: var(--r2wx-color-blue);
                width: 100%;


                .r2wx-list-entries {
                    text-transform: capitalize;
                    overflow: auto;

                    a {
                        text-decoration: none;
                        color: var(--r2wx-color-blue-dark);
                        /*border-bottom: 1px solid #555;*/

                        &:hover {
                            color: white;
                            background: var(--r2wx-color-yellow);
                            border-color: inherit;
                        }
                    }

                }
            }
        }
    }
</style>