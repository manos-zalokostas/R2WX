import {localApi, dependencies, packEntityForm, blink} from "$lib";
import httpServer from "$lib/httpServer.js";
import ctx from "../ctx.js";


const {entity, typ, lit} = ctx();


/** @tye {import('./$types').PageServerLoad} */
export async function load({parent, url, params: {lang, evt_id}}) {


    let [{data}, cache] = await dependencies(
        httpServer.get([entity, evt_id].join("/")),
        parent(),
    )


    const form = packEntityForm(typ, lit, data, {
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

