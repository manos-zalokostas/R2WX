import {localApi, dependencies, packEntityForm} from "$lib";
import ctx from "./ctx.js"


const {typ, lit} = ctx();


/** @tye {import('./$types').PageServerLoad} */
export async function load({cookies, parent, url, params: {lang, id}, request}) {


    let [cache] = await dependencies(
        parent()
    )

    const form = packEntityForm(typ, lit, null, {
        id: {hidden: true},
        active: {hidden: true},
    });

    console.log({form})
    return {
        ...cache,
        form,
        _page: {
            HEAD_H1: 'ΜΟΝΑΔΑ'
        },
    }

}

