<script>
    import {SVGI} from "$lib/SVGIcon.js";
    import SVG from "$lib/client/component/SVG.svelte";
    import httpClient from "$lib/httpClient.js";
    import {reload} from "$lib/client/component/R2wxFormActions.js";

    const onclickDeleteEntry = async evt => {
        evt.preventDefault();
        console.log(" -- MULTIPART ENTRY PATH :: ", evt.currentTarget.href)
        const res = await httpClient.invoke(evt.currentTarget.href, 'delete')
        console.log(" -- MULTIPART ENTRY RESULT :: ", res)
        if (!res.error) reload()
    }

    const {
        url,
        tip = 'confirm',
        direct = 'top',
    } = $props();

</script>

<div class="r2wx-tooltip">

    <span class="r2wx-entry-x">
        <SVG icon={SVGI.DELX} color="white"/>
    </span>

    <span class="r2wx-msg r2wx-{direct}">
        <strong>Are you sure you want to delete this record?</strong>
        <a href={url} onclick={onclickDeleteEntry}>confirm</a>
    </span>

</div>


<style lang="scss">

  .r2wx-tooltip {
    position: relative;
    display: inline-block;
    margin: 0 10px;

    .r2wx-entry-x {
      line-height: 0;
      padding: 4px;
      width: 18px;
      margin: 0;
      border-radius: 5px;
      background: red;

      &:hover {
        //background: #aaa;
        cursor: not-allowed;
      }

    }

    .r2wx-msg {
      position: absolute;
      z-index: 1;
      visibility: hidden;
      opacity: 0;
      transition: opacity 0.3s;
      text-align: left;
      color: white;
      padding: 10px 20px;
      background: var(--r2wx-color-yellow);
      width: 200px;

      a {
        line-height: 2;
        vertical-align: middle;
        text-decoration: none;
        padding: 0 10px;
        border: 1px solid;
        color: gold;

        &:hover {
          color: white;
          background: red;
        }
      }


      &.r2wx-top {
        left: 50%;
        bottom: 100%;
        margin-left: -34px;
        /* Tooltip arrow */
        &::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50px;
          transform: rotate(90deg);
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: transparent transparent transparent var(--r2wx-color-blue);
        }
      }


    }

    &:hover .r2wx-msg {
      visibility: visible;
      opacity: 1;
    }
  }
</style>
