import {localApi, dependencies, packEntityForm, makeOptions} from "$lib";
import httpServer from "$lib/httpServer.js";
import ctx from "./ctx.js";

const {entity, typ, lit} = ctx();


/** @tye {import('./$types').PageServerLoad} */
export async function load({parent}) {

    let [
        {data: owners},
        {data: categories},
        cache,
    ] = await dependencies(
        httpServer.get("stat_owner"),
        httpServer.get("stat_category"),
        parent()
    )
    
    console.log(" -- CATEGORIES / OWNERS", {owners, categories})

    const form = packEntityForm(typ, lit, null, {
        id: {hidden: true},
        _option: {
            category_id: makeOptions(categories),
            owner_id: makeOptions(owners),
        }
    });


    return {
        ...cache,
        form,
        _page: {
            HEAD_H1: 'ΜΟΝΑΔΑ'
        },
    }

}

