<script>
    import {form} from "$store";
    import {FORM} from "$var";

    let {
        active,
        name = "",
        reverse = false,
        action = () => null,
    } = $props();

    const onclick = async (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        currActive = !currActive;
        if (action) await action(currActive)
    }

    const evalSwitchBg = () => {
        if ($form.mode === FORM.READ) return 'ligthblue'
        if (currActive) return '#a2bd3f'
        return 'grey'
    }

    let currActive = $state(active),
        switchBg = $derived(evalSwitchBg())

    // $inspect(switchBg)

</script>


<div class="r2wx-control">

    <button aria-label="swith-flat"
            class="switch {currActive ? 'active' : '' } {reverse ? ' reverse' : '' }"
            style="background:{switchBg}"
            {onclick}>
        <input type="checkbox"/>
        <span class="slider {currActive ? 'active' : ''}">&nbsp;</span>
    </button>

    <em>{name}</em>

</div>

<style>

    .switch {
        display: inline-block;
        position: relative;
        height: 16px;
        width: 32px;
        border: 1px solid #444;

        &.reverse {
            transform: rotateY(180deg);
        }

        .slider {
            position: absolute;
            top: 0;
            left: calc(100% - 16px);
            height: 10px;
            width: 12px;
            margin: 2px;
            cursor: pointer;
            transition: .4s;
            background: white;

            &.active {
                left: 0;
            }
        }
    }

    .r2wx-control {

        .r2wx-info {
            display: block;
            white-space: initial;
            text-transform: capitalize;
            text-align: inherit;
            color: #777;
        }

        input {
            display: none;
        }
    }

</style>