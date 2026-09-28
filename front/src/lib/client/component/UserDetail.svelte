<script>
    import SVG from "$lib/client/component/SVG.svelte";
    import {SVGI} from "$lib/SVGIcon.js";

    let {user} = $props();

</script>

<div class="r2wx-user">

    <span>
        <strong>{user.first} {user.last}</strong>
        <u>{user.email}</u>
    </span>

    <span class="r2wx-icon-mid">
<!--        <SVG icon={SVGI.USER}/>-->
    </span>

</div>


<style>
    .r2wx-user {
        display: flex;
        align-items: center;
        color: white;

        span {
            text-align: right;
        }

        strong {
            display: block;
            text-transform: capitalize;
            font-size: large;
        }

        u {
            text-decoration: underline;
            text-align: center;
        }

        .r2wx-icon-mid {
            width: 60px;
        }
    }
</style>