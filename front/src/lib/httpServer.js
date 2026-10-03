import {ENV_DATASERVER, ENV_SECRET, ENV_ROLE_ADMIN, ENV_ROLE_READER} from "$env/static/private";
import http from "$lib/http.js";


export default {

    ...http,


    async invoke(path, method, body = null) {
        try {

            const url = this.url(path, ENV_DATASERVER)
            const isMulti = body instanceof FormData;
            console.log(" >>>>>>>>>>>>>> URL <<<<<<<<<<<<<< ", {url})
            let content = {
                headers: new Headers(_headers(isMulti)),
                method,
            };
            if (body) content.body = !isMulti ? JSON.stringify(body) : body;

            let req = new Request(url, content);

            const res = await fetch(req);

            const clone = res.clone();

            let feed;
            try {
                feed = await res.json();
            } catch (error) {
                return await clone
            }

            return feed;


        } catch (error) {
            throw new Error(error);
        }
    },


    async streamProxy(path, request, method = 'POST') {

        const url = this.url(path, ENV_DATASERVER);

        const head = new Headers(request.headers);
        const headAuth = _headers(true);

        head.set('Authorization', headAuth['Authorization']);
        head.set('X-User-Role', headAuth['X-User-Role']);

        try {
            const res = await fetch(url, {
                headers: new Headers(head),
                body: request.body,
                method, // <-- Dynamically supports 'PUT' or 'POST'
                duplex: 'half'
            });

            return res;

        } catch (error) {
            console.error('Error proxying request to Core API:', error);
            return new Response('Error connecting to the backend service.', {status: 502});
        }
    }
}

/**
 *
 * @param isMulti
 * @returns {{Authorization: string}}
 * @private
 */
const _headers = (isMulti = false) => {

    let header = {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${ENV_SECRET}`,
        'X-User-Role': ENV_ROLE_ADMIN,
    }

    if (isMulti) delete header['Content-Type'];

    return header;
}