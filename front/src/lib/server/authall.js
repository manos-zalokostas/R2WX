import {PUBLIC_BASEPATH} from "$env/static/public";
import {ENV_ROLE_ADMIN, ENV_ROLE_READER} from "$env/static/private";
import _Ticket from "$lib/server/ticket.js";
import httpServer from "$lib/httpServer.js";
import {dev} from '$app/environment';
import {ROLE} from "$var";


const NO_LOGIN = 'NOLOG';
const COOKIE = 'ecacc';
const COOKIE_CTX = {
    maxAge: 60 * 60 * 24,
    httpOnly: true,
    sameSite: 'lax',
    secure: !dev,
    path: '/',
};


/*

 */
export default () => ({

    cookies: null,
    header: null,
    profile: null,
    ticket: null,
    orgid: null,
    url: null,


    /**(
     *
     * @param ctx
     * @private
     */
    _init: function (ctx) {

        let {cookies, request} = ctx,
            httpHeader = Object.fromEntries([...request.headers]);

        this.cookies = cookies;
        this.header = httpHeader;

        const url = new URL(request.url);
        const urlp = new URLSearchParams(url.search);
        //
        this.url = url;
        // this.orgid = urlp.get('org');
    },


    /**
     *
     * @param ctx
     * @returns {Promise<*|null>}
     */
    login: async function (ctx) {

        let rawUser, email = 'not-set', pass = 'not-set';

        try {

            this._init(ctx);

            let body = await ctx.request.json();
            email = body.email;
            pass = body.pass;

            if (!(email && pass)) throw 'LOG|NOCRED';

            rawUser = await this._verifyUser(email, pass)
            if (!rawUser) throw 'LOG|NOUSER';


            this.profile = await this._resolveProfile(rawUser);
            if (!this.profile) throw 'LOG|NOPROFILE';


            this.ticket = _Ticket.create(this.profile, this.header)
            if (!this.ticket) throw 'LOG|NOTICKET'


            this.cookies.set(COOKIE, this.ticket, COOKIE_CTX);


            return this.profile


        } catch (err) {

            console.log(err, {email, pass: 'XXXX'})
            this.profile = null;
            this.cookies.set(COOKIE, NO_LOGIN, COOKIE_CTX);
            return null;
        }
    },


    /**
     *
     * @param ctx
     * @returns {*|null}
     */
    access: function (ctx, refresh = true) {
        let hasAccess, cval;
        const openPaths = [
            '/api/ticket',
            PUBLIC_BASEPATH + "/",
        ]
        try {
            // if (req.query.exit) return this.deprecate()
            
            this._init(ctx);

            cval = this.cookies.get(COOKIE);


            // cval = this._resolveCookieValue()
            if (!cval || cval === NO_LOGIN) throw 'ACC|NOCOOKIE'


            this.profile = _Ticket.verify(cval, this.header);
            if (!this.profile) throw 'ACC|NOTVERF'


            // console.log(">>>>>>>>> DEBUG", this.url)
            hasAccess = openPaths.includes(this.url.pathname) || this._evalDataAccess();
            if (!hasAccess) throw 'ACC|NOACCESS'


            if (refresh) {
                let ticket = _Ticket.refresh(this.profile, this.header)
                if (!ticket) throw 'ACC|NOTICKREF'
                this.cookies.set(COOKIE, ticket, COOKIE_CTX);
            }


            return this.profile


        } catch (err) {

            this.profile = null;
            console.log(err, {cval, orgid: this.orgid})
            this.cookies.set(COOKIE, NO_LOGIN, COOKIE_CTX);

            return null;
        }

    },

    /**
     *
     * @returns {*|null}
     * @private
     */
    accessRole: function (ctx, levelMin = ROLE.GLOB) {
        let hasRoleAccess;

        try {

            this.access(ctx, false);
            if (!this.profile) throw 'ACC|NOPROFILE'

            const roleCurr = this.profile.user.role,
                levelCurr = ROLE[roleCurr] || ROLE.VISIT

            hasRoleAccess = +levelCurr >= +levelMin;
            if (!hasRoleAccess) throw 'ACC|NOROLEACC'

            return this.profile;

        } catch (err) {
            console.log(err)
            this.profile = null;
            this.cookies.set(COOKIE, NO_LOGIN, COOKIE_CTX);
            return null;
        }
    },


    /**
     *
     * @param ctx
     * @returns {Promise<null>}
     */
    clear: async function (ctx) {

        await this._init(ctx);

        this.cookies.set(COOKIE, NO_LOGIN, COOKIE_CTX);

        return null;
    },


    /**
     *
     * @returns {Promise<*|boolean>}
     * @private
     */
    _verifyUser: async function (email, pass) {
        try {

            // const url = http.url("user/authenticate", ENV_DATASERVER)
            const userRaw = await httpServer.post("user/authenticate", {email, pass})

            return userRaw;

        } catch (err) {
            console.log(err, {email, pass: 'xxx'})
            return false;
        }
    },


    /**
     *
     * @param raw
     * @returns {Promise<{access: ({owns, uses}|null), user: {owns, uses: *, preferred_user, given_name: *, family_name: *, email}}>}
     * @private
     */
    _resolveProfile: async function (raw) {
        let user, access;
        try {

            user = this._resolveUserInfo(raw)

            access = await this._resolveUserAccess(raw.AppAccess)

            return {user, access}

        } catch (err) {
            throw new Error(err);
        }
    },


    /**
     *
     * @param raw
     * @returns {{owns, uses: *, preferred_user, given_name: *, family_name: *, email}}
     * @private
     */
    _resolveUserInfo: function (raw) {
        let user;
        try {

            const SAM_USERRAW = {
                "id": 3,
                "first": "username",
                "last": "lastname",
                "email": "user@example.com",
                "created": "2025-07-07T13:36:47.315Z",
                "updated": "2025-07-07T13:36:47.315Z",
                "APP_ACCESS": [
                    {
                        "id": 1,
                        "type": "GLOB",
                        "user_id": 3,
                        "org_id": 1,
                        "created": "2025-07-03T17:22:58.000Z",
                        "updated": null
                    }
                ]
            }


            user = {
                id: raw.id,
                first: raw.first,
                last: raw.last,
                email: raw.email,
                role: raw.APP_ACCESS[0].type,
            }


            return user;


        } catch (err) {
            // console.log(err, {user, cacheKey, access, isCacheOk, isCacheOnly})
            throw new Error(err);
        }
    },


    /**
     *
     * @param access
     * @returns {Promise<{owns, uses}|null>}
     * @private
     */
    _resolveUserAccess: async function (access) {

        let uses, owns;

        try {

            let orgs = {}

            if (!access[0]) throw 'NO ORGANIZATION ACCESS AVAILABLE';

            uses = access.map(o => {
                    orgs[o.org_id] = o.StatOrg.name;
                    return o.org_id
                }
            )

            owns = access.filter(o => o.type === 'OWN')
                .map(o => {
                    orgs[o.org_id] = o.StatOrg.name;
                    return o.org_id
                })


            return {
                owns,
                uses,
                orgs,
            }


        } catch (err) {
            // console.log(err, {access})
            return null;
        }
    },


    /**
     *
     * @returns {*|null}
     * @private
     */
    _evalDataAccess: function () {
        let hasAccess;

        try {

            hasAccess = this.profile.access?.uses.includes(+this.orgid);

            if (!hasAccess) {
                hasAccess = [ENV_ROLE_ADMIN, ENV_ROLE_READER].includes(this.profile.user.role);
                console.log(" >>> IS ADMIN USER =>  ", Object.is(this.profile.user.role, ENV_ROLE_ADMIN))
                // console.log(" >>> USER PROFILE  ", this.profile)
            }

            return hasAccess

        } catch (err) {
            // console.log(err, {orgid: this.orgid, profile: this.profile})
            return null;
        }
    },


})


