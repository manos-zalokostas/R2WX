<script>
    import Detailable from "$lib/client/component/Detailable.svelte";
    import SVG from "$lib/client/component/SVG.svelte";
    import {SVGI} from "$lib/SVGIcon.js";
    import {REQ} from "$var";
    import {ui} from "$store";

    let styleOpacity = '',
        styleDisplay = '';

    let {
        links = [
            'one',
            'two',
            'three',
            'four',
            'five'
        ]
    } = $props();

</script>


{#if $ui.alertBox.status}

    <div class="alert {styleOpacity} {styleDisplay} r2wx-shadowable-card active">

        {#if $ui.alertBox.status === REQ.WAIT}
            <span class="sg-spin">
            <SVG icon={SVGI.PARA} color="yellow"/>
            </span>
            <p>request in progress . . .</p>
        {/if}

        {#if $ui.alertBox.status === REQ.OK}
            <span>
                <SVG icon={SVGI.PARA} color="greenyellow"/>
            </span>
            <p>request accepted </p>
        {/if}

        {#if $ui.alertBox.status === REQ.ERR}
            <span>
                <SVG icon={SVGI.PARA} color="tomato"/>
            </span>
            <p>request rejected </p>
        {/if}

        {#if $ui.alertBox.status === REQ.BRE}
            <span>
                <SVG icon={SVGI.PARA} color="orange"/>
            </span>
            <p>request cancelled </p>
        {/if}

        <button class="closebtn" disabled={[REQ.WAIT].includes($ui.alertBox.status)}
                onclick={() => {
                  $ui.alertBox = {
                      status: '',
                      links: []
                  }
          }}>
            &times;
        </button>

        {#if $ui.alertBox.links[0]}
            <Detailable title="ΧΡΗΣΙΜΑ LINKS">
                <nav>
                    {#each links as link}
                        <a href="#{link}">ilnk</a>
                    {/each}
                </nav>
            </Detailable>
        {/if}

    </div>

{/if}

<style>

    nav {
        display: flex;
        flex-direction: column;
        background: #eee;
        width: 100%;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .sg-spin {
        transform-origin: center;
        animation: spin 2s linear infinite;
    }


    .alert {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;

        position: fixed;
        right: 16px;
        bottom: 16px;
        z-index: 10;
        opacity: 1;

        transition: opacity 0.6s;

        color: white;
        padding: 5px;
        width: 400px !important;;
        background: var(--r2wx-color-black);

        p {
            color: white;
            text-transform: capitalize;
        }

        &.hide {
            display: none;
        }

        &.fade {
            opacity: 0;
        }

        span {
            width: 50px;
        }
    }


    /* The close button */
    .closebtn {
        float: right;
        margin-left: 15px;
        color: white;
        font-weight: bold;
        line-height: 20px;
        border: none;
        outline: none;
        background: none;
        transition: 0.3s;
        cursor: pointer;
        /*background: white;*/
    }

    /* When moving the mouse over the close button */
    .closebtn:hover {
        color: var(--r2wx-color-yellow);
    }
</style>
