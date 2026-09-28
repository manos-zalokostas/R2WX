<script>
    import {page} from "$app/stores";
    import {ROLE} from "$var";

    let {
        alert = '',
        children,
        level = ROLE.GLOB,
    } = $props();

    const roleCurr = $page.data.profile?.user?.role || 'VISIT',
        levelCurr = +(ROLE[roleCurr] || ROLE.VISIT),
        levelRequired = +level;

</script>

{#if levelRequired > levelCurr}
    {alert}
{:else}
    {@render children()}
{/if}
