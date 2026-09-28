<script>

    import {clearInputReport} from "$lib/client/component/R2wxFormActions.js";
    import {active} from "$store";
    import {form} from "$store";
    import {FORM} from "$var";

    let {id} = $props();

    let [disabled, input] = $derived([
        [FORM.READ, FORM.DEL].includes($form.mode),
        {...$active.form[id], type: null}
    ])

</script>


<textarea {...input}
          class="r2wx-form-input {disabled ? 'disabled' : ''}"
          oninput={clearInputReport}></textarea>


<style>

    /*textarea {*/
    /*    width: 100%;*/
    /*    height: 100px;*/
    /*    border: none;*/
    /*    background: none;*/
    /*    outline: none;*/
    /*    color: white;*/
    /*    border-top: 1px solid #bbb !important;*/
    /*    background: var(--r2wx-color-grey-dark) !important;*/

    /*    &:hover {*/
    /*        border: 1px solid #bbb;*/
    /*    }*/

    /*    &.disabled {*/
    /*        border: none;*/
    /*        background: none !important;*/
    /*    }*/

    /*}*/


</style>
