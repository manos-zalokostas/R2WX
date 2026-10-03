<script>
    import {clearFormReports} from "./R2wxFormActions.js";
    import SVG from "$lib/client/component/SVG.svelte";
    import {SVGI} from "$lib/SVGIcon.js";
    import {form, active} from "$store";
    import {FORM} from "$var";

    const {ctx} = $props()

    const onclick = (mode = FORM.ADD, evt) => {
        evt.preventDefault();
        clearFormReports();
        $form.mode = mode;
        if ([FORM.ADD, FORM.EDIT].includes(mode)) {
            $form.isEdited = true;
            $form.isCancelable = true;
        }
        if ([FORM.DEL].includes(mode)) {
            $form.isEdited = false;
            $form.isCancelable = true;
        }
        if ([FORM.READ].includes(mode)) {
            $form.isEdited = false;
            $form.isCancelable = false;
        }
    }
</script>
{#if !$active.isFormFilled && !$form.isEdited}
    <button class="r2wx-shadowable-btn r2wx-add"
            onclick={evt => onclick(FORM.ADD, evt)}>
        <strong class="r2wx-nomob">insert</strong>
        <span><SVG icon={SVGI.FORA} color="greenyellow"/></span>
    </button>
{/if}
{#if $active.isFormFilled && !$form.isEdited}
    <button class="r2wx-shadowable-btn r2wx-edit"
            onclick={evt => onclick(FORM.EDIT, evt)}>
        <span><SVG icon={SVGI.FORE} color="lightblue"/></span>
        <strong class="r2wx-nomob">modify</strong>
    </button>
<!--    <button class="r2wx-shadowable-btn r2wx-del"-->
<!--            onclick={evt => onclick(FORM.DEL, evt)}>-->
<!--        <strong class="r2wx-nomob">remove</strong>-->
<!--        <span><SVG icon={SVGI.FORD} color="tomato" /></span>-->
<!--    </button>-->
{/if}
{#if $form.isEdited && !ctx.blockConfirm}
    <button class="r2wx-shadowable-btn r2wx-exit"
            onclick={evt => onclick(FORM.READ, evt)}>
        <strong class="r2wx-nomob">cancel</strong>
        <span><SVG icon={SVGI.FORC} color="grey"/></span>
    </button>
{/if}
