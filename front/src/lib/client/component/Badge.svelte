<script>
    import SVG from "$lib/client/component/SVG.svelte";
    import {SVGI} from "$lib/SVGIcon.js";
    import {goto} from "$app/navigation";

    const {name = 'badge filter', link = '/dev-path'} = $props()
    const onclick = () => {
        goto(link)
    }

</script>

<section>
    <div>
        <button class="r2wx-badge"
                {onclick}>
            <strong class="r2wx-badge-content">{name}</strong>
            <span class="r2wx-icon-mid">
                <SVG icon={SVGI.DELX} color="white"></SVG>
            </span>
        </button>
    </div>
</section>


<style>

    section {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        div {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: normal;

            button {
                display: flex;
                white-space: nowrap;
                text-overflow: ellipsis;
                text-transform: capitalize;
                text-align: center;
                color: var(--r2wx-color-blue-dark);
                /*max-width: 115px;*/
                padding: 10px 16px;
                border-radius: 5px;
                border: 1px solid #ccc;
                overflow: hidden;
                cursor: pointer;
                outline: none;
                margin: 15px;
                background: var(--r2wx-color-yellow);

                span {
                    width: 18px;
                    margin: 0 0 0 15px;
                }
            }

        }

    }
</style>
