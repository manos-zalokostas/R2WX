const log = (err) => console.log('ERRLC', {err})



export default {


    /**
     *
     * @param key
     * @returns {any}
     */
    get(key) {
        try {

            let entry = sessionStorage.getItem(key);

            if (!entry) return false;

            return JSON.parse(entry);

        } catch (err) {
            log(err)
        }
    },


    /**
     *
     * @param key
     * @returns {any|null}
     */
    getChild(key) {
        try {

            let [root, idx] = key.split("."),
                json = sessionStorage.getItem(root);

            if (!json) return false;
            let cache = JSON.parse(json);

            return cache[idx];

        } catch (err) {
            log(err)
        }
    },


    /**
     *
     * @param key
     * @param val
     */
    set(key, val) {
        try {

            if (!val) return false;
            sessionStorage.setItem(key, JSON.stringify(val))

            return true;

        } catch (err) {
            log(err)
        }
    },


    /**
     *
     * @param key
     * @param val
     */
    setChild(key, val) {
        try {

            let [root, idx] = key.split("."),
                cache = this.get(root);

            if (!cache) cache = {};

            cache[idx] = val;
            this.set(root, cache);

            return true;

        } catch (err) {
            log(err)
        }
    },


    /**
     *
     * @param key
     */
    unset(key) {
        try {

            if (!this.get(key)) return false;

            sessionStorage.removeItem(key);

        } catch (err) {
            log(err)
        }
    },


    /**
     *
     * @param key
     */
    unsetChild(key) {
        try {

            let [root, idx] = key.split("."),
                cache = this.get(root);

            if (!cache) return false;

            delete cache[idx];
            this.set(root, cache);

        } catch (err) {
            log(err)
        }
    },


    /**
     *
     */
    reset() {
        try {

            sessionStorage.clear();

        } catch (err) {
            log(err)
        }
    },


    /**
     *
     * @param o
     * @returns {*}
     * @private
     */
    _hash(o) {

        if (!o) {
            return false;
        }

        let j = JSON.stringify(o);
        let _hash = 0, chr;

        if (j.length === 0) {
            console.log('LOGERR|ZERO-LENGHT KEY IS ERRONEOUS.. ');
            return false;
        }
        var i = 0;
        for (i = 0; i < j.length; i++) {
            chr = j.charCodeAt(i);
            _hash = ((_hash << 5) - _hash) + chr;
            _hash |= 0;
        }
        return _hash;
    },


}




