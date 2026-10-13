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


<input {...{...input, type: input.type === 'float' ? "number" : input.type}}
       class="r2wx-form-input {disabled ? 'disabled' : ''}"
       oninput={clearInputReport}/>
