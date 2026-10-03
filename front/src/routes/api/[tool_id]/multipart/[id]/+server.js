import _authall from "$lib/server/authall.js";
import {_reply} from "$lib/server/index.js";
import httpServer from "$lib/httpServer.js";
import {ROLE} from "$var";


export async function DELETE(ctx) {
    try {

        const Auth = _authall();
        if (!Auth.accessRole(ctx, ROLE.GLOB)) return _reply({error: 'NOROL'});

        const path = [
            ctx.params.tool_id,
            'multipart',
            ctx.params.id,
        ].join("/")

        console.log(" -- DELETE:: PATH:: ", path)
        const res = await httpServer.invoke(path, 'delete')

        console.log(" -- DELETE:: RES:: ", res)
        return _reply(res);

    } catch (error) {
        console.log("++++++++++++++++++++++", error)
        throw new Error(error);
    }
}

/**
 * R2WX EXTENSION EXPERIMENT — GOOGLE GEMINI
 *
 * This multipart PUT flow was produced by Gemini after being
 * asked to study and reuse the existing R2WX infrastructure
 * to implement the missing multipart update path.
 *
 * Human-reviewed after generation.
 */
export async function PUT(ctx) {
    try {
        const Auth = _authall();
        if (!Auth.accessRole(ctx, ROLE.GLOB)) return _reply({error: 'NOROL'});

        // Resolves nested path: e.g. "sam/multipart/12"
        const path = [
            ctx.params.tool_id,
            'multipart',
            ctx.params.id,
        ].join("/");

        console.log(" -- PUT MULTIPART:: PATH:: ", path);

        // Uses the existing streamProxy with method parameter set to PUT
        const res = await httpServer.streamProxy(path, ctx.request, 'PUT');

        return res;

    } catch (error) {
        console.log(" -- PUT MULTIPART PROXY ERROR: ", error);
        throw new Error(error);
    }
}