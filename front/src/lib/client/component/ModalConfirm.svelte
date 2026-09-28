<script>
    import {canSubmit, formReport} from "$lib/client/component/R2wxFormActions.js";
    import SVG from "$lib/client/component/SVG.svelte";
    import {SVGI} from "$lib/SVGIcon.js";
    import {form} from "$store";
    import {FORM} from "$var";
    import {ui} from "$store";

    const BUTTON = {
        [FORM.ADD]: ['create', 'add'],
        [FORM.READ]: ['create', 'add'],
        [FORM.EDIT]: ['update', 'edit'],
        [FORM.DEL]: ['delete', 'del'],
    }

    let {head = "Final Confirmation ", children} = $props();

    let modeCurr = $form.mode || FORM.ADD;
    let currBtn = $state(BUTTON[modeCurr]);
    // let currBtn = $state(BUTTON[FORM.ADD]);

</script>

<button class="r2wx-shadowable-btn r2wx-{currBtn[1]}"
        onclick={() =>{
             if (!canSubmit()) return formReport();
            $ui.confirmBox =1
        }}>
    <strong>{currBtn[0]}</strong>
    <span>
        <SVG icon={SVGI.FORO} color="greenyellow"/>
    </span>
</button>

<div id="modal-wrap" class="w3-modal {$ui.confirmBox ? 'active' : ''}">
    <div class="w3-modal-content w3-animate-bottom w3-card-4">

        <header class=" r2wx-{currBtn[1]}">
            <h3>{head}</h3>
            <button class="r2wx-shadowable-btn " onclick={() =>$ui.confirmBox = 0}>&times;</button>
        </header>

        <section>

            <button class="r2wx-shadowable-btn" onclick={()=> $ui.confirmBox = 0}>
                <strong> cancel </strong>
                <span>
                    <SVG icon={SVGI.FORC}/>
                </span>
            </button>

            {#if children}
                {@render children()}
            {:else}
                CONFIRM BUTTON
            {/if}

        </section>

    </div>
</div>
<style>

    .w3-modal-content {
        width: 500px;
        background: var(--r2wx-color-blue-dark);

        header {
            color: var(--r2wx-color-yellow);

            h3 {
                text-align: center;
                margin: auto;
            }


            button {
                display: initial;
                line-height: 0;
                color: inherit;
                height: 16px;
                width: 16px;
                margin: 0;
                padding: 0;
            }

        }
    }

    section {
        display: flex;
        justify-content: center;
        gap: 10px;
    }

    .r2wx-add {

        /*color: var(--r2wx-color-blue);*/
        /*background: var(--r2wx-color-yellow);*/
    }

    .r2wx-edit {
        /*color: white;*/
        /*background: steelblue;*/
    }

    .r2wx-del {
        /*color: white;*/
        /*background: indianred;*/
    }

    #modal-wrap {
        display: none;
        z-index: 10;

        &.active {
            display: block;
        }
    }
</style>