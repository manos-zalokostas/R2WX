<script>
    import DateRangeFilter from "$lib/client/component/DateRangeFilter.svelte";

    let {
        title = 'ΦΙΛΟΞΕΝΗΤΗΣ',
        path = "_entity_/range",
    } = $props();

</script>

<div class="r2wx-list-control">

    <DateRangeFilter path={path}/>

</div>

<style>

    .r2wx-list-control {
        padding: 5px;

    }
</style>