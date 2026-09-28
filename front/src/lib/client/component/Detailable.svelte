<!-- DetailableList.svelte (Svelte 5 Version - Inlined Ternary) -->
<script>
    import SVG from "$lib/client/component/SVG.svelte";
    import {SVGI} from "$lib/SVGIcon.js";
    import {strdate} from "$lib";

    let {
        title = "HELTOROKDT",
        expandall = true,
        icon = SVGI.SCHE
    } = $props();

    // Inlined ternary logic directly into the $derived assignment
    let name = $derived(parseInt(title) ? strdate(title) : title);
</script>

<section class="r2wx-detailable-list ">
    <article class="r2wx-detailable">
        <details open={expandall}>
            <summary>
                <slot name="slot-detailable-head">
                    <header>
                        <div>
                            <span class="r2wx-detail-arrow"><SVG icon={SVGI.BACK}/></span>
                            <h4>{name}</h4>
                        </div>
                        {#if icon}
                            <span><SVG {icon}/></span>
                        {/if}
                    </header>
                </slot>
            </summary>
            <div class="r2wx-detailable-ctn">
                <slot>DEFAULT DETAILS SLOT CONTENT </slot>
            </div>
        </details>
    </article>
</section>

<!-- Styles remain the same -->
<style >
  summary {
    display: block;
    cursor: pointer;
    outline: none;
  }
  summary header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  summary header .r2wx-detail-arrow {
    display: inline-block;
    transform: rotate(270deg);
    margin: 10px;
    width: 18px;
    transition: transform 0.2s ease-in-out;
  }
  details[open] > summary header .r2wx-detail-arrow {
    transform: rotate(360deg);
  }
  .r2wx-detailable-ctn {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px 0;
  }
</style>