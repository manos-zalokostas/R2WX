<script>

    import {SVGI} from "$lib/SVGIcon.js";
    import SVG from "$lib/client/component/SVG.svelte";
    import {clearInputReport} from "$lib/client/component/R2wxFormActions.js";
    import {apiPath, apiUrl, filterInputAttrs} from "$lib";
    import httpClient from "$lib/httpClient.js";
    import {form, active} from "$store";
    import {page} from "$app/stores";
    import {FORM} from "$var";

    let {id} = $props();

    let files = $state([])

    let event = $derived($page.data.params.evt_id)

    let [disabled, input] = $derived([
        [FORM.READ, FORM.DEL].includes($form.mode),
        filterInputAttrs($active.form[id] || {type: 'text'})
    ])

    const evalMultiSelect = evt => {
        files = [...evt.target.files].map(o => o.name)
    }

    const d = $page.data;

</script>

{#if input.value}
    <nav>
        {#each input.value as {originalname, filename: file}}
            {@const query = {tool: $page.data.breadcrump[1], type: input.id, event, file}}
            {@const url = httpClient.urlquery('files', query)}
            <a id={input.id} href={apiUrl(url)} download>
                <strong>{originalname}</strong>
                <span>
                    <SVG icon={SVGI.FLDW} color="goldenrod"/>
                </span>
            </a>
        {/each}
    </nav>

{:else}
    <input {...input}
           class="r2wx-form-input {disabled ? 'disabled' : ''}"
           onchange={evalMultiSelect}
           oninput={clearInputReport}/>

    {#if files.length > 1}
        <div>
            {#each files as fname,i}
                <em>- {i + 1}. {fname}</em>
            {/each}
        </div>
    {/if}
{/if}

<style>

    nav {
        color: var(--r2wx-color-blue);
        padding: 10px 0;
    /*    width: 100%;*/
    /*    height: 45px;*/
    /*    border: none;*/
    /*    outline: none;*/
        border-top: 1px solid #bbb !important;
    /*    background: none;*/

        a {
            display: flex;
            justify-content: space-between;
            text-decoration: none;
            pointer-events: initial;

            span {
                width: 22px;
            }
        }
    /*}*/

    /*input {*/
    /*    padding: 10px 0;*/
    /*    width: 100%;*/
    /*    height: 45px;*/
    /*    border: none;*/
    /*    outline: none;*/
    /*    color: white;*/
    /*    border-top: 1px solid #bbb !important;*/
    /*    background: var(--r2wx-color-grey-dark) !important;*/

    /*    &:hover {*/
    /*        border: 1px solid #bbb;*/
    /*    }*/

    /*    &.disabled {*/
    /*        border: none;*/
    /*        background: none !important;*/
    /*    }*/

    }


</style>
