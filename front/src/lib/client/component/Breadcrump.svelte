<script>
    import {page} from "$app/stores";

    let {entries} = $props();


    const makeLinks = (a) => {
        let root = "/";
        return a.reduce(
            (acc, x) => {
                acc.push([x, root += x + "/"])
                return acc;
            }, [['home', root]]
        );
    }

    const fn = () => {
        if (!$page.data.path) return makeLinks(entries || [])
        return makeLinks($page.data.breadcrump)
    }

    const paths = $derived(fn() || [])

</script>

<ul class="breadcrumb">
    {#each paths as [name, link], i}

        {#if i < paths.length - 1}
            <li><a href={link}>{name}</a></li>
        {/if}

    {/each}
</ul>


<style>
    ul.breadcrumb {
        padding: 0;
        margin: 0;
    }

    ul.breadcrumb li {
        display: inline;
        font-size: 13px;
        color: var(--r2wx-color-yellow);
    }

    ul.breadcrumb li + li:before {
        padding-left: 4px;
        content: "/\00a0";
    }

    ul.breadcrumb li a {
        color: var(--r2wx-color-yellow);
        text-decoration: none;
    }

    ul.breadcrumb li a:hover {
        color: dodgerblue;
        text-decoration: underline;
    }
</style>
