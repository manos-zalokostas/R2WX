import httpServer from "$lib/httpServer.js";
import {dependencies} from "$lib";
import {TOOL} from "../../../../var/index.js";


/** @tye {import('./$types').PageServerLoad} */
export async function load({parent}) {


    let [
        {data: sam},
        {data: samx},
        cache
    ] = await dependencies(
        httpServer.get('/sam/latest'),
        httpServer.get('/samx/latest'),
        parent(),
    )
    // console.log(" ++++++++++++++++++++ SAM-X LATEST", {samx})

    const events = [
        ...sam.map(o => ({...o, tool: TOOL.SAM})),
        ...samx.map(o => ({...o, tool: TOOL.SAMX})),
    ]

    const eventsNext = _order(events)

    return {
        ...cache,
        events: eventsNext,
        _page: {
            HEAD_H1: 'ΜΟΝΑΔΑ'
        },
    }

}


const _order = (a) => {

    const tmp = {};
    a.forEach(
        o => tmp['' + Date.parse(o.created)] = o
    )

    const tmpK = Object.keys(tmp);
    tmpK.sort();
    tmpK.reverse();


    const aNext = [];
    tmpK.forEach(
        k => aNext.push(tmp[k])
    )
    return aNext;

}