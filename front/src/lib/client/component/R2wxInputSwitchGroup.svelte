<script>
    import {action} from "$store";
    import {active} from "$store";

    let { id } = $props();


    const input = $active.form[id];
    const boxes = $state(input.options.map(
        (opt, i) => {
            // console.log({opt})
            let id = input.id + `_${opt}`;
            return {
                id: id,
                name: id,
                type: 'checkbox',
                options: [input["data-options-literals"][i], ""],
                value: input.value.includes(opt),
                checked: true,
            }
        }
    ))
</script>


<div class="r2wx-form-input r2wx-check-opt">
    {#each boxes as input}
        {@const {id, options} = input}
        <section>
            <strong>{options?.[1] || ''}</strong>
            <div class="switch {input.value ? 'active' : '' }">
                <input {...input} value={input.value} checked={input.value}/>
                <span class="slider round"
                      onclick={()=> {
                          $action[input.id] && $action[input.id]();
                          input.value = input.checked = !input.checked;
                      }}>
                </span>
            </div>
            <strong>{options?.[0] || ''}</strong>
        </section>
    {/each}
</div>


<style >
  .r2wx-check-opt {

    section {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      margin: auto;
    }
  }

  strong, .switch {
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


    //
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


  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
</style>
