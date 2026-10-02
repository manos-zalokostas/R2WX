import _authall from "$lib/server/authall.js";
import {_reply} from "$lib/server/index.js";
import httpServer from "$lib/httpServer.js";
import {ROLE} from "$var";



export async function PUT(ctx) {
    try {

        const Auth = _authall();
        if (!Auth.accessRole(ctx, ROLE.GLOB)) return _reply({error: 'NOROL'});

        const path = [
            ctx.params.tool_id,
            ctx.params.id,
        ].join("/")

        const data = await ctx.request.json();
        console.log(" -- PUT:: PATH / DATA:: ", {path, data})

        const res = await httpServer.put(path, data)

        console.log(" -- PUT:: RES:: ", res)
        return _reply(res);

    } catch (error) {
        console.log("++++++++++++++++++++++", error)
        throw new Error(error);
    }
}