import {localApi, dependencies, packEntityForm} from "$lib";


/** @tye {import('./$types').PageServerLoad} */
export async function load({cookies, parent, url, params: {lang, id}, request}) {


    let [cache] = await dependencies(
        parent()
    )


    return {
        ...cache,
        _page: {
            HEAD_H1: 'ΜΟΝΑΔΑ'
        },
    }

}

