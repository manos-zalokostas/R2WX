import {dependencies} from "$lib";


/** @type {import('./$types').PageServerLoad} */
export async function load({parent}) {


    
    let [cache] = await dependencies(
        parent()
    )

    return {
        ...cache,
        _page: {
            HEAD_H1: 'ΑΡΧΙΚΗ'
        },
    };


}
