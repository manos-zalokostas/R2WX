<script>
    import Wrapper from "$lib/client/component/Wrapper.svelte";
    import EventList from "$lib/client/component/EventList.svelte";
    import {page} from "$app/stores";
    import {PAGE} from "$var";

    const {events} = $page.data;
</script>


<Wrapper ctx={PAGE.STLAT}>

    <div class="r2-event-list">

        <EventList list={events}/>

    </div>

</Wrapper>

<style>

    .r2-event-list {
        display: flex;
        flex-direction: column;
        gap: 25px;
    }

</style>