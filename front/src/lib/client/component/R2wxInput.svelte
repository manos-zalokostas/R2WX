<script>

    import {clearInputReport} from "$lib/client/component/R2wxFormActions.js";
    import {filterInputAttrs} from "$lib";
    import {form, active} from "$store";
    import {FORM} from "$var";

    let {id} = $props();

    let [disabled, input] = $derived([
        [FORM.READ, FORM.DEL].includes($form.mode),
        filterInputAttrs($active.form[id] || {type: 'text'})
    ])

</script>


<input {...input}
       class="r2wx-form-input {disabled ? 'disabled' : ''}"
       oninput={clearInputReport}/>


<style>

    /*input {*/
    /*    padding: 10px 0;*/
    /*    width: 100%;*/
    /*    height: 45px;*/
    /*    border: none;*/
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
