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
        ].join("/")

        const data = await ctx.request.json();
        console.log(" -- POST:: PATH / DATA:: ", {path, data})
        const res = await httpServer.post(path, data)

        console.log(" -- POST:: RES:: ", res)
        return _reply(res);

    } catch (error) {
        console.log("++++++++++++++++++++++", error)
        throw new Error(error);
    }
}