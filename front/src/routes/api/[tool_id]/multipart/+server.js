import _authall from "$lib/server/authall.js";
import {_reply} from "$lib/server/index.js";
import httpServer from "$lib/httpServer.js";
import {ROLE} from "$var";


export async function POST(ctx) {
    try {

        const Auth = _authall();
        if (!Auth.accessRole(ctx, ROLE.GLOB)) return _reply({error: 'NOROL'});

        const path = [
            ctx.params.tool_id,
            'multipart'
        ].join("/")

        const res = await httpServer.streamProxy(path, ctx.request)

        return res;

    } catch (error) {
        console.log("++++++++++++++++++++++", error)
        throw new Error(error);
    }
}