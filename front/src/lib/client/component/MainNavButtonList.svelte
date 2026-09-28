<script>
    import {SVGI} from "$lib/SVGIcon.js";
    import SVG from "$lib/client/component/SVG.svelte";

    let {
        ctx = [],
        icon = SVGI.SELO,
        active = $bindable(false),
        children
    } = $props();

    const [name, path, role] = ctx;
    // let activeSection = $derived(path.startsWith($page.data.path))


</script>


<section class="r2wx-button-drop noprint {active ? 'active' : ''}">

    <button class="r2wx-shadowable-menu-btn {active ? 'active' : ''}"
            onclick={() => active = !active}>
        <strong class="r2wx-hover r2wx-nomob">{name} </strong>
        <span class="r2wx-icon-max">
                    <SVG {icon} color="white"/>
                </span>
    </button>

    <nav>
        {#if children}
            {@render children()}
        {:else}
            BUTTONS LIST NAV
        {/if}
    </nav>

</section>

<style>
    button {
        color: white;
        text-transform: uppercase;
        background: var(--r2wx-color-blue-dark);

        &:hover,
        &.active {
            color: var(--r2wx-color-blue);
            background: var(--r2wx-color-black);
        }

    }
</style>