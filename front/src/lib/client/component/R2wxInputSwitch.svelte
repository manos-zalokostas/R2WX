<script>
    import {exportOpts, filterInputAttrs} from "$lib";
    import {action, active, form} from "$store";

    let {id} = $props();

    let options = $derived(exportOpts($active.form[id]))
    let input = $state(filterInputAttrs($active.form[id]))

    // $inspect(" -- -INPUT --- ", input)

</script>

<section class="r2wx-form-input">

    <strong>{options?.[0] || ''}</strong>
    <div class="switch {String(input.value) === 'true' ? 'active' : '' }">
        <input {...{...input, type: "checkbox"}} value="{input.value || 'false'}"/>
        <button class="slider round" title="choose"
              onclick={()=> {
                  $action[input.id] && $action[input.id]()
                  input.checked = !input.checked;
                  input.value = String(input.checked);
                  // console.log(">>>>>>>>> INPUT ACTIVE: ", input.value)
          }}>
                </button>
    </div>
    <strong>{options?.[1] || ''}</strong>

</section>

<style>

    section {
        display: flex;
        justify-content: center;

        strong, .switch {
            float: left;
            line-height: 2;
            font-weight: normal;
            color: #777
        }

        .switch {
            display: inline-block;
            position: relative;
            margin: 6px 15px;
            height: 21px;
            width: 49px;


            &.active .slider {
                background-color: #2196F3;
                box-shadow: 0 0 1px #2196F3;
            }

            &.active .slider:before {
                -webkit-transform: translateX(26px);
                -ms-transform: translateX(26px);
                transform: translateX(26px);
            }
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            -webkit-transition: .4s;
            transition: .4s;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 14px;
            width: 14px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            -webkit-transition: .4s;
            transition: .4s;
        }

        .slider.round {
            border-radius: 34px;
        }

        .slider.round:before {
            border-radius: 50%;
        }
    }
</style>
