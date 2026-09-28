<script>

    const DOMTargetSelector = '.r2-indexable';
    let value = '';
    const _filter = (evt) => {
        value = evt.target.value.toLowerCase();
        console.log(' --- VALUE :: ', value)
        document.querySelectorAll(DOMTargetSelector)
            .forEach(elem => elem.classList.add('r2wx-nodisplay')
            )
        if (!value) return;
        document.querySelectorAll(DOMTargetSelector)
            .forEach(elem => {
                    if (elem.dataset['name'].toLowerCase().includes(value)) elem.classList.remove('r2wx-nodisplay')
                }
            )
    }

    let {
        title = 'title',
        path = "/path",
    } = $props();


</script>


<div class="r2wx-list-control ">

    <input type="text" placeholder="search.."
           class="w3-input w3-padding"
           onkeyup={_filter }
           onclick={_filter}/>

    <i class="fa fa-search">&nbsp;</i>

</div>

<style>


    .r2wx-list-control {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 5px;

        input {
            color: var(--r2wx-color-yellow);
            background: none;
        }

        i {
            color: var(--r2wx-color-yellow);
            font-size: large;
        }
    }

</style>