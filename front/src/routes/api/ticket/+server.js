import {_reply} from "$lib/server";
import _authall from "$lib/server/authall.js";
import {redirect} from "@sveltejs/kit";
import {ROLE} from "$var";

/**
 *
 * @param ctx
 * @returns {Promise<Response|undefined>}
 * @constructor
 */
export async function POST(ctx) {

    const Auth = _authall();

    let user = await Auth.login(ctx)
    if (!user) return _reply({error: 'NOACC'});

    return _reply({data: user});

}


/**
 *
 * @param ctx
 * @returns {Promise<Response>}
 * @constructor
 */
export async function DELETE(ctx) {

    const Auth = _authall();
    if (!Auth.accessRole(ctx, ROLE.READ)) return _reply({error: 'NOROL'});

    await Auth.clear(ctx)

    return _reply({error: 'NOACC'});

}