<script> import {DateInput} from 'date-picker-svelte'

let {id,} = $props();

</script>


<div class="r2wx-form-input datepick-wrap ">
    <div {id} class="r2wx-proxy-id">
        <DateInput format="dd-MM-yyyy"
                   value={new Date()}
        />
    </div>
</div>

<style>

    /*.datepick-wrap {*/
    /*    display: flex;*/
    /*    margin: 4px 0 8px 0;*/
    /*    color: white !important;*/
    /*    border-top: 1px solid #bbb;*/
    /*    background: var(--r2wx-color-grey-dark) !important;*/

    /*    > div {*/
    /*        margin: 2px;*/
    /*    }*/

    /*    &.disabled {*/
    /*        border: none;*/
    /*        background: none !important;*/
    /*    }*/
    /*}*/

</style>
