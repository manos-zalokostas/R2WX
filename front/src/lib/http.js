export default {


    /**
     *
     * @param path
     * @param host
     * @param query
     * @returns {module:url.URL}
     */
    url(path, host, query = null) {

        let url = new URL(path, host)

        if (query) url.search = this.querystring(query)

        return url;
    },


    /**
     *
     * @param path
     * @param o
     * @returns {string}
     */
    urlquery(path, o) {

        return [path, this.querystring(o)].join("?")

    },

    /**
     *
     * @param o
     * @returns {module:url.URLSearchParams}
     */
    query(o) {
        return new URLSearchParams(o)
    },


    /**
     *
     * @param o
     * @returns {string}
     */
    querystring(o) {
        return this.query(o).toString();
    },


    /**
     *
     * @param o
     * @returns {{[p: string]: string}}
     */
    queryobject(o) {
        return Object.fromEntries(this.query(o))
    },


    /**
     *
     * @param url
     * @returns {Promise<void|*>}
     */
    async get(path){

        return await this.invoke(path, 'GET')

    },


    /**
     *
     * @param url
     * @param data
     * @returns {Promise<void|*>}
     */
    async post(path, data){

        return await this.invoke(path, 'POST', data)

    },


    /**
     *
     * @param url
     * @param data
     * @returns {Promise<void|*>}
     */
    async put(path, data){

        return await this.invoke(path, 'PUT', data)

    },


    /**
     *
     * @param url
     * @returns {Promise<void|*>}
     */
    async delete(path){

        return await this.invoke(path, 'DELETE')

    },


    /**
     * @abstract This method MUST be overridden by a concrete implementation.
     */
    invoke(path, type, data) {
        throw new Error("HTTP 'invoke' method is abstract. It has to be override by Client / Server Http wrapper");
    }

}

