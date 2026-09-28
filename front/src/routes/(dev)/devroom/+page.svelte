<script>
    import "w3-css";
    import {SVGI} from "$lib/SVGIcon.js";
    import SVG from "$lib/client/component/SVG.svelte";
</script>

<article>
    {#each Object.entries(SVGI) as [key, icon]}
        <div>
            <SVG {icon} color="white"/>
            <br/>
            <strong>{key}</strong>
        </div>
    {/each}
</article>

<style>
    article {
        display: flex;
        flex-wrap: wrap;

        div {
            display: flex;
            flex-direction: column;
            text-align: center;
            margin: 10px;
            padding: 10px;
            width: 100px;
            border: 4px solid #ddd;
            background: #aaa;
        }
    }
</style>


