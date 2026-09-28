<script>
    import {exportOpts, filterInputAttrs} from "$lib";
    import {active, form} from "$store";
    import {FORM} from "$var";


    let {id} = $props();


    let [input, disabled, values, options] = $derived([
        filterInputAttrs($active.form[id]),
        [FORM.READ, FORM.DEL].includes($form.mode),
        exportOpts($active.form[id]),
        exportOpts($active.form[id]),
    ])


    const oninput = (evt) => {
        let val = +evt.target.value,
            idx = values.indexOf(val);
        if (idx < 0) return values = [...values, val];
        delete values[idx]
        values = values.filter(Number)
    }

</script>

<select class="r2wx-form-input {disabled ? 'disabled' : ''}" {...input}
        bind:value={values}>

    {#each options as option, i}
        <option value={option} {oninput}>
            {$active.form[id]['data-options-literals'][i]}
        </option>
    {/each}

</select>


<style>

    /*select {*/
    /*    border: none;*/
    /*    border-top: 1px solid #bbb;*/
    /*    padding: 10px;*/
    /*    width: 100%;*/
    /*    color: initial;*/

    /*    &.disabled {*/
    /*        background: none;*/
    /*        border: none;*/
    /*        border-top: 1px solid #bbb;*/
    /*    }*/
    /*}*/

</style>
