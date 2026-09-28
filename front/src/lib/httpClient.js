import {PUBLIC_APPSERVER} from '$env/static/public'
import {goto} from "$app/navigation";
import http from "$lib/http.js";

const NOACC = 'NOACC';


export default {

    ...http,

    /**
     *
     * @param url
     * @param method
     * @param body
     * @returns {Promise<void|any>}
     */
    async invoke(path, method, body = null) {

        try {
            const url = this.url(path, PUBLIC_APPSERVER)
            const isMulti = body instanceof FormData;

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

            if (feed.error && feed.error === NOACC) return goto(PUBLIC_APPSERVER + '/ticket');

            return feed;


        } catch (error) {
            throw new Error(error);
        }
    },


    // /**
    //  *
    //  * @param url
    //  * @returns {Promise<void>}
    //  */
    // async download(url) {
    //     try {
    //
    //         const response = await fetch(url);
    //
    //         if (!response.ok) throw new Error(`Download failed with status: ${response.status}`);
    //
    //         const blob = await response.blob();
    //
    //         const downloadUrl = window.URL.createObjectURL(blob);
    //
    //         const link = document.createElement('a');
    //         link.href = downloadUrl;
    //
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);
    //         window.URL.revokeObjectURL(downloadUrl);
    //
    //     } catch (error) {
    //         console.error("Download failed:", error);
    //         alert("Sorry, the file could not be downloaded.");
    //     }
    // },


}


/**
 *
 * @param isMulti
 * @returns {{Authorization: string}}
 * @private
 */
const _headers = (isMulti = false) => {

    let header = {}

    if (!isMulti) header['Content-Type'] = 'application/json; charset=UTF-8';

    return header;
}