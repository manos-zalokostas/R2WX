import _authall from "$lib/server/authall.js";
import {_reply} from "$lib/server/index.js";
import httpServer from "$lib/httpServer.js";
import {ROLE} from "$var";


/**
 *
 * @param ctx
 * @returns {Promise<Response>}
 * @constructor
 */
export async function GET(ctx) {

    const Auth = _authall();
    if (!Auth.accessRole(ctx, ROLE.READ)) return _reply({error: 'NOROL'});

    let urlLoca = new URL(ctx.request.url),
        {tool, file, event, type} = httpServer.queryobject(urlLoca.search)

    const pathDownload = [
        tool, event, 'type', type, 'files', file
    ].join("/")

    const pathPreview = [
        tool, 'preview', file
    ].join("/")

    const path = event ? pathDownload : pathPreview


    // console.log("++++++++++++++++++++++ TEST ", {url})

    return await httpServer.get(path)
}

