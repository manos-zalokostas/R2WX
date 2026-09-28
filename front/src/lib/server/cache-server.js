export default {

    /*

     */
    data: {},

    /**
     *
     * @param key
     * @returns {*}
     */
    get: (key) => this.data[key],


    /**
     *
     * @param key
     * @param entry
     */
    set: (key, entry) => this.data[key] = entry,


    /**
     *
     * @returns {{}}
     */
    reset: () => this.data = {}


}
