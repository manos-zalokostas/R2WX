
/**
 *
 * @param feed
 * @returns {Response}
 */
export const _reply = (feed) => {
    return new Response(JSON.stringify(feed), {
        headers: {
            'Content-Type': 'application/json'
        }
    })

}