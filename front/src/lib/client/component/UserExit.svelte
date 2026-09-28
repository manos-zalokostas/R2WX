<script>
    import {reload} from "$lib/client/component/R2wxFormActions.js";
    import SVG from "$lib/client/component/SVG.svelte";
    import httpClient from "$lib/httpClient.js";
    import {SVGI} from "$lib/SVGIcon.js";
    import {apiPath} from "$lib";

</script>

<span class="r2wx-icon-max">
    <button onclick={() => {
        httpClient.delete(apiPath("ticket"))
        reload(500)
    } }>
        <SVG icon={SVGI.EXIT} color="tomato"/>
    </button>
</span>

<style>
    span {
        position: absolute;
        right: 0;
    }
    button {
        background: none;
        outline: none;
        border: none;
        line-height: 0;
        padding: 0;
        margin: 0;

        &:hover {
            background: tomato;
            cursor: pointer;
        }
    }
</style>