import {localApi, dependencies} from "$lib";
import httpServer from "$lib/httpServer.js";


/** @tye {import('./$types').PageServerLoad} */
export async function load({parent, params: {tool_id}}) {


    let [{data: entries}, cache] = await dependencies(
        httpServer.get(tool_id),
        parent()
    )


    return {
        ...cache,
        entries,
        _page: {
            HEAD_H1: 'ΜΟΝΑΔΑ'
        },
    }

}

