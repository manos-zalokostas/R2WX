<script>
    import R2wxFormModeButtons from "$lib/client/component/R2wxFormModeButtons.svelte";
    import R2wxFormSubmitButtons from "$lib/client/component/R2wxFormSubmitButtons.svelte";
    import R2wxFormStatus from "$lib/client/component/R2wxFormStatus.svelte";
    import ModalConfirm from "$lib/client/component/ModalConfirm.svelte";
    import {form} from "$store";

    const {ctx} = $props()

    $effect(() => {
        console.log(ctx)

    })
</script>

<header>

    <div class="r2wx-form-modes">
        <R2wxFormModeButtons {ctx}/>
    </div>

    <R2wxFormStatus/>

    {#if $form.isEdited}
        <div class="r2wx-form-actions">
            {#if ctx.blockConfirm}
                <R2wxFormSubmitButtons {ctx}/>
            {:else}
                <ModalConfirm>
                    <R2wxFormSubmitButtons {ctx}/>
                </ModalConfirm>
            {/if}
        </div>
    {/if}

</header>


<style> .r2wx-form-modes {
    display: flex;
}
</style>