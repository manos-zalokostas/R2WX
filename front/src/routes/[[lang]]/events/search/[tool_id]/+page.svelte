<script>
    import R2wxFilterDate from "$lib/client/component/R2wxFilterDate.svelte";
    import R2wxFilter from "$lib/client/component/R2wxFilter.svelte";
    import EventList from "$lib/client/component/EventList.svelte";
    import {page} from "$app/stores";


</script>


<section>

    <R2wxFilter {...{
        title: 'event title',
        path: "/name"
    }}/>


    <R2wxFilterDate {...{
        title: "record date",
        path: '/dates'
    }}/>

</section>


<EventList list={$page.data.entries} hidden={true}/>


<style>
    section {
        display: flex;
        justify-content: space-between;
        margin: 50px 5px
    }
</style>
