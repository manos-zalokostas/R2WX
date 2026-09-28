<script>

    import SVG from "$lib/client/component/SVG.svelte";
    import {DateInput} from 'date-picker-svelte';
    import {SVGI} from "$lib/SVGIcon.js";
    import dayjs from "dayjs";

    const DOMTargetSelector = '.r2-indexable';

    let first = $state(dayjs().toDate());
    let last = $state(dayjs().toDate());

    const dateid = (d) => dayjs(d).format('YYYYMMDD');

    const _attempFilterRange = () => {
        if (!(first && last)) return;

        const dStart = +dateid(first),
            dEnd = +dateid(last);

        if (dEnd >= dStart) {
            document.querySelectorAll(DOMTargetSelector)
                .forEach(elem => elem.classList.remove('r2wx-nodisplay')
                )
            document.querySelectorAll(DOMTargetSelector)
                .forEach(elem => {
                        const dateSel = +elem.dataset['date'],
                            inRange = dateSel >= dStart && dateSel <= dEnd;
                        if (!(inRange)) elem.classList.add('r2wx-nodisplay')
                    }
                )
        }
    }
</script>

<div class="r2wx-form-input r2wx-date-range-filter">

    <div role="button"
         tabindex={4}
         onkeydown={null}
         onmouseenter={null}
         onclick={_attempFilterRange}>
        <DateInput format="dd-MM-yyyy" bind:value={first}/>
    </div>

    <span><SVG icon={SVGI.SCHE} color="goldenrod"/></span>

    <div role="button"
         tabindex={5}
         onkeydown={null}
         onmouseenter={null}
         onclick={_attempFilterRange}>
        <DateInput format="dd-MM-yyyy" bind:value={last}/>

    </div>

</div>

<style>

    .r2wx-date-range-filter {
        display: flex;
        justify-content: flex-end;

        span {
            width: 24px;
        }
    }

</style>