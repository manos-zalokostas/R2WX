<script>
    import R2wxFormHeader from "$lib/client/component/R2wxFormHeader.svelte";
    import {form, active} from "$store";
    import {onDestroy} from "svelte";
    import {FORM} from "$var";

    let {blockEdit, mode, ctx} = $props();

    if (blockEdit !== undefined) {
        $form.mode = FORM.READ;
        $form.isEditable = false;
    }

    if (mode !== undefined) $form.mode = mode;


    onDestroy(
        () => $form = {
            uri: null,
            isEdited: false,
            isEditable: false,
            isCancelable: false,
            mode: FORM.READ,
            action: null
        }
    )

</script>


<div class="r2wx-form-wrapper {$form.isEdited ? 'edited' : '' }">

    {#if !blockEdit}
        <R2wxFormHeader {ctx}/>
    {/if}


    {#if $active.form}
        <form class="r2wx-form">
            <slot/>
        </form>
    {/if}


</div>


