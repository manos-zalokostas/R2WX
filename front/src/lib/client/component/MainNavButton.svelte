<script>
    import {SVGI} from "$lib/SVGIcon.js";
    import SVG from "$lib/client/component/SVG.svelte";
    import {goto} from "$app/navigation";
    import {page} from "$app/stores";

    let {
        ctx = [],
        icon = SVGI.SELO,
    } = $props();

    const [name, path, role] = ctx;
    console.log($page.data.path, " -- ", path)
    let active = $derived($page.data.path.startsWith(path))

</script>


<button class="r2wx-shadowable-menu-btn {active ? 'active' : ''}"
        onclick={() => goto(path)}>
    <strong class="r2wx-hover r2wx-nomob">{name} </strong>
    <span class="r2wx-icon-max">
        <SVG {icon} color="white"/>
    </span>
</button>

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