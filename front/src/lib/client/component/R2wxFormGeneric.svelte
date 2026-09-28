<script>
    import R2wxFormHeader from "$lib/client/component/R2wxFormHeader.svelte";
    import R2wxFieldsetInput from "$lib/client/component/R2wxFieldsetInput.svelte";
    import {form, active} from "$store";
    import {FORM} from "$var";

    let {blockEdit, isEdited, mode, ctx} = $props();

    if (blockEdit !== undefined) $form.isEditable = false;

    $form.mode = mode || FORM.READ;
    $form.isEdited = isEdited;

</script>

<div class="r2wx-form-wrapper {$form.isEdited ? 'edited' : '' }">

    {#if !blockEdit}
        <R2wxFormHeader {ctx}/>
    {/if}

    {#if $active.form}

        <form class="r2wx-form">
            {#each Object.values($active.form) as attr  }
                <R2wxFieldsetInput id={attr.id}/>
            {/each}
        </form>

    {/if}

</div>