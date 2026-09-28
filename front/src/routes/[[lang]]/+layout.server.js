import authall from "$lib/server/authall.js";
import {redirect} from "@sveltejs/kit";
import {pathify} from "$lib";

const Auth = authall()

/** @type {import('./$types').LayoutServerLoad} */
export async function load(ctx) {

    let {url, params} = ctx;

    const profile = Auth.access(ctx)
    if (!profile) throw redirect(302, "/authenticate")


    // const urlsearch = new URLSearchParams(url.search);
    // const orgCurr = +urlsearch.get('org') || 11111111

    if (url.pathname === "/favicon.png") return {}

    const breadcrump = url.pathname.split("/").splice(1);
    let {lang} = params;


    let data = {
        profile,
        params,
        breadcrump,
        lang: lang || 'en',
        path: pathify(...breadcrump),
        // strQ: url.search || "?org=" + orgCurr,
        orgAvail: [],
        // orgCurr,
        _: {
            lang: lang || 'en',
            page: {},
        }
    };

    return data;
}



