<script>
    import {ui} from "$store";
    import SVG from "$lib/client/component/SVG.svelte";
    import {SVGI} from "$lib/SVGIcon.js";

    let {name} = $props();


</script>

<div class="sg-card">

    <button type="button" class="collapsible "
            onclick={evt => {
                console.log('HANDLER 1 (Child Button) FIRED'); // <-- Add this
                        $ui.searchToolDialogOpen = !$ui.searchToolDialogOpen

            }}>
        <strong>{name}</strong>
        <span class="r2wx-icon-min r2wx-rotate-270">
            <SVG icon={SVGI.BACK} color="dodgerblue"/>
        </span>
    </button>

    <div class="content { $ui.searchToolDialogOpen? 'show' : ''}">
        <slot/>
    </div>

</div>

<style>
    .sg-card {
        position: relative;
        margin: 5px;
        padding: 5px;
        min-width: 250px;
        border-bottom: 4px solid var(--r2wx-color-blue);
    }

    .collapsible {
        text-align: left;
        font-size: small;
        font-weight: bold;
        text-transform: uppercase;

        outline: none;
        border: none;
        margin: 10px 0;
        padding: 10px;
        width: 100%;
        cursor: pointer;
    }

    .collapsible:hover {
        color: var(--r2wx-color-black) !important;
    }

    .collapsible.active {
        color: var(--r2wx-color-blue) !important;
        text-decoration: underline;
        font-weight: bold;
    }

    .content {
        display: none;
        overflow: hidden;
        max-height: 0;
        transition: max-height 0.2s ease-out;
        background-color: #eee !important;

        &.show {
            display: initial;
            max-height: initial;
        }
    }

    button {
        display: flex;
        justify-content: space-between;
        color: #eee !important;
        text-transform: capitalize;
        background: none;

        &:hover {
            strong {
                color: var(--r2wx-color-blue) !important;
            }
        }
    }
</style>