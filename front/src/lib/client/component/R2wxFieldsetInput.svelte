<script>

    import R2wxInputSwitch from "$lib/client/component/R2wxInputSwitch.svelte";
    import R2wxInputSelectMulti from "$lib/client/component/R2wxInputSelectMulti.svelte";
    import R2wxInputFile from "$lib/client/component/R2wxInputFile.svelte";
    import R2wxInputTextarea from "$lib/client/component/R2wxInputTextarea.svelte";
    import Datepicker from "$lib/client/component/Datepicker.svelte";
    import R2wxInputSelect from "./R2wxInputSelect.svelte";
    import R2wxInputLabel from "./R2wxInputLabel.svelte";
    import R2wxInput from "./R2wxInput.svelte";
    import {active} from "$store";
    import {form} from "$store";
    import {FORM} from "$var";


    let {id = 'sample-key', virtual} = $props();

    // $inspect($page.data)

    let [input, disabled] = $derived([
        $active.form?.[id] || virtual || {},
        [FORM.READ, FORM.DEL].includes($form.mode),
    ])

</script>

{#if input && !input.hidden}


    <!--{#if input.type !== 'hidden'}-->

    <fieldset name={id +"-field"}
              class={(disabled) ? '' : "r2wx-shadowable-card"}
              disabled={disabled || input['data-field-hidden']}
              style={input['data-field-hidden']  ? "display: none" : ''}
              class:datefield={input.type === 'date'}>

        {#if ['text', 'number', 'password', 'email'].includes(input.type)}

            <R2wxInputLabel {id}/>
            <R2wxInput {id}/>

        {:else if ['file'].includes(input.type)}

            <R2wxInputLabel {id}/>
            <R2wxInputFile {id}/>


        {:else if input.type === 'textarea'}

            <R2wxInputLabel {id}/>
            <R2wxInputTextarea {id}/>

        {:else if input.type === 'select' }

            <R2wxInputLabel {id}/>
            <R2wxInputSelect {id}/>


        {:else if input.type === 'select-multi' }

            <R2wxInputLabel {id}/>
            <R2wxInputSelectMulti {id}/>


            <!--{:else if input.type === 'checkbox'}-->

            <!--    <R2wxInputLabel {id}/>-->
            <!--    <br/><br/>-->
            <!--    <R2wxInputSwitch {id}/>-->

        {:else if input.type === 'switch'}
            <!--{@debug input}-->
            <R2wxInputLabel {id}/>
            <R2wxInputSwitch {id}/>


        {:else if input.type === 'date'}

            <R2wxInputLabel {id}/>
            <Datepicker {id}/>


        {:else}
            <R2wxInputLabel {id}/>
            <code>** TP-INPUT NOT RECOGNIZED ** {id} </code>
        {/if}

    </fieldset>


    <!--{:else }-->

    <!--    <div style="display: none">-->
    <!--        <R2wxInputLabel {id}/>-->
    <!--        <R2wxInput {id}/>-->
    <!--    </div>-->

    <!--{/if}-->


{/if}


<style>

    fieldset {
        margin: 10px;
        min-height: 75px;
        width: 300px;

        &[disabled] {
            border: none;
        }

    }
</style>