<script>
    import {clearInputReport} from "$lib/client/component/R2wxFormActions.js";
    import {exportOpts, filterInputAttrs} from "$lib";
    import {active, form, valid} from "$store";
    import {FORM} from "$var";

    let {id} = $props();


    let [input, disabled, options] = $derived([
        filterInputAttrs($active.form[id]),
        [FORM.READ, FORM.DEL].includes($form.mode),
        exportOpts($active.form[id])
    ])

    // console.log(">>>>>>>>>>>>> ", $active.form, id, {options});

    const onchange = (evt) => {
        $valid.action[input.id] && $valid.action[input.id](evt.target)
    }, oninput = clearInputReport

</script>

<select class="r2wx-form-input {disabled ? 'disabled' : ''}"
        {...input}
        {onchange}
        {oninput}>

    <option value=""> -- select</option>
    {#each options as option, i}
        <option value={option}>
            {$active.form[id]['data-options-literals'][i]}
        </option>
    {/each}
</select>


<style>
    /*select {*/
    /*    border: none;*/
    /*    border-top: 1px solid #bbb;*/
    /*    padding: 10px;*/
    /*    height: 45px;*/
    /*    width: 100%;*/
    /*    color: initial;*/

    /*    &.disabled {*/
    /*        background: none;*/
    /*        border: none;*/
    /*        border-top: 1px solid #bbb;*/
    /*    }*/
    /*}*/

</style>
