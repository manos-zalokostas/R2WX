import {localApi, dependencies, packEntityForm} from "$lib";

const ENTITY = 'UNIT'
const DIR = 'unit'

/** @tye {import('./$types').PageServerLoad} */
export async function load({cookies, parent, url, params: {lang, id}, request}) {


    const org_id = +url.searchParams.get('org');
    const uri = localApi(ENTITY, id, org_id)

    let [cache] = await dependencies(
        parent()
    )


    return {
        ...cache,
        uri,
        // formOptions,
        _page: {
            HEAD_H1: 'ΜΟΝΑΔΑ'
        },
    }

}

