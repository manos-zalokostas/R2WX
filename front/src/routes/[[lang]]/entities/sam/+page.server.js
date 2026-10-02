import {localApi, dependencies, packEntityForm} from "$lib";
import ctx from "./ctx.js";

const {typ, lit} = ctx();


/** @tye {import('./$types').PageServerLoad} */
export async function load({parent}) {


    let [cache] = await dependencies(
        parent()
    )


    const form = packEntityForm(typ, lit, null, {
        active: {hidden: true},
        id: {hidden: true},
    });



    return {
        ...cache,
        form,
        _page: {
            HEAD_H1: 'ΜΟΝΑΔΑ'
        },
    }

}

