import {PUBLIC_BASEPATH, PUBLIC_APPSERVER} from '$env/static/public'
import {PAGE, TOOL} from "$var";


/*
 *
 * @param a
 * @returns {string}
 */
export const blink = (...a) => {

    let link = [PUBLIC_BASEPATH, ...a].join("/");

    link = link.replaceAll("//", "/");

    return link;

}

export const low = (t) => t && t.toLowerCase() || ''

export const upp = (t) => t && t.toUpperCase() || ''

/*
 *
 * @param a
 * @returns {string}
 */
export const apiPath = (...a) => {

    let link = ['api', ...a].join("/");
    link = link.replaceAll("//", "/");
    // console.log(">>>>>>>>>>>>> LOCAL API PATH ", {link})

    return link;

}


/**
 *
 * @param a
 * @returns {string}
 */
export const apiUrl = (...a) => {

    let link = [PUBLIC_APPSERVER, 'api', ...a].join("/");
    // link = link.replaceAll("//", "/");
    // console.log(">>>>>>>>>>>>> LOCAL API URL ", {link})

    return link;

}


/**
 *
 * @param i
 * @returns {string}
 */
export const zeroable = (i) => +i > 9 ? `${i}` : `0${i}`


/**
 *
 * @param i
 * @returns {string}
 */
export const strdate = (i = "20240102") => {
    let a = ('' + i).split(""),
        year = a.splice(0, 4),
        month = a.splice(0, 2),
        day = a;

    return [...day, '/', ...month, '/', ...year].join("");

}


/**
 *
 * @param str
 * @returns {*|string}
 */
export const unitname = (str) => str?.replaceAll("_", " ") || '';


/**
 *
 * @param a
 * @returns {*}
 */
export const mapStatics = (a) => a.reduce((acc, o) => ({...acc, [o.id]: o.name}), {})


/**
 *
 * @param unitid
 * @param data
 * @returns {*|string}
 */
export const uname = (unitid, data) => {
    return data.aliases[unitid]
        ? data.aliases[unitid].split(" ").slice(0, 3).join(" ")
        : "** " + data.noaliases[unitid]
}


/**
 *
 * @param form
 * @param rule
 */
export const merge = (form, rule = {}) => {
    // console.log("rule ----- MULE ", {rule})
    Object.entries(form)
        .forEach(
            ([key, entry]) => {
                if (key in rule) form[key] = {...entry, ...rule[key]}
            }
        )

}


/**
 *
 * @param units
 * @param statics
 * @returns {[{[p: string]: any},{[p: string]: any}]}
 */
export const unitAlias = (units, statics = {}) => {
    try {

        let aliases = [],
            noaliases = [],
            alias;

        let {hosts = {}, hosttypes = {}, places = {}, unittypes = {}, brands = {}, btus = {}} = statics

        units.forEach(
            unit => {

                let {MixUnitHost: host} = unit.Action.find(o => o.type === "INS") || {};

                host = Array.isArray(host) && host[0]
                    ? host[0]
                    : {}

                if (!host.host_id) return noaliases.push([unit.id, unit.name]);

                alias = [
                    hosts[host.host_id] || "-",
                    places[host.place_id] || "-",
                    host.order || "-",
                    brands[unit.brand_id],
                    btus[unit.btu_id],
                    unittypes[unit.type_id],
                ]

                aliases.push([unit.id, alias.join(" ")])

            }
        )


        return [
            Object.fromEntries(aliases),
            Object.fromEntries(noaliases),
        ];

    } catch (error) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", error)
    }
}


/**
 *
 * @param a
 * @returns {string}
 */
export const pathify = (...a) => {
    if (a[0] === 'en') a.shift();
    return "/" + a.filter(String).join("/");
}


/**
 *
 * @param prev
 * @param next
 * @param keys
 * @returns {*}
 */
export const schemaMod = (prev, next, ...keys) => {
    keys.forEach(
        key => prev[key] = {...prev[key], ...next[key]}
    )
    return prev;
}


/**
 *
 * @param a
 * @returns {Promise<Awaited<unknown>[]|*[]>}
 */
export const dependencies = async (...a) => {


    let reqs = await Promise.all(a)


    let jsons = reqs.map(
        data => {

            if (!data) return null;

            if (typeof data !== 'object') return data;

            if ('json' in data) return data.json()

            if ('default' in data && typeof data.default !== 'function') return structuredClone(data.default)

            if ('default' in data && typeof data.default === 'function') return data.default()

            return data;

        })

    return jsons[0]
        ? await Promise.all(jsons)
        : []

}


/**
 *
 * @param input
 * @returns {{[p: string]: unknown}}
 */
export const filterInputAttrs = (input) => {
    let valid = Object.entries(input)
        .filter(([attr, val]) => !(attr.startsWith('data-') || attr === 'options'))

    return Object.fromEntries(valid);
}


/**
 *
 * @param input
 * @returns {*}
 */
export const exportOpts = (input) => {
    return input["data-options"];
}


/**
 *
 * @param filters
 * @param map
 * @param orgid
 * @returns {{include: {Action: {include: {MixUnitHost: boolean}, where: {org_id: *, active: boolean}}}, orderBy: {id: string}, where: {org_id: *, id}}|*|null}
 */
export const resolveQueryFromPath = (filters, map, orgid) => {
    if (!filters) return null;

    const [filter, value] = filters.split("/");

    if (isFinite(filter)) return map["_finite"](filter, orgid)

    return map[filter](value, orgid);
}


/**
 *
 * @param filters
 * @returns {[*,*]|[string,*]|[string,string]}
 */
export const resolvePathFilter = (filters) => {

    if (!filters) return ["XXX", "YYYY"];

    let [filter, value] = filters.split("/");

    if (isFinite(filter)) {
        value = filter;
        return ['_finite', value]
    }

    return [filter, value]
}


/**
 *
 * @param id
 * @param entity
 * @param org_id
 * @returns {{all: string}}
 */
export const localApi = (entity, id = null, org_id) => {
    let ctx = {}
    if (id) ctx = {all: PUBLIC_APPSERVER + `/api?entity=${entity}&id=${id}&org=${org_id}`}
    else ctx = {all: PUBLIC_APPSERVER + `/api?entity=${entity}&org=${org_id}`}
    return ctx;
}


/**
 *
 * @param id
 * @param entity
 * @param org_id
 * @returns {{all: string}}
 */
export const remoteApi = (entity, id = null, org_id) => {

    return ctx;
}


/**
 *
 * @param typ
 * @param lit
 * @param data
 * @param rule
 * @returns {{[p: string]: unknown}}
 */
export const packEntityForm = (typ, lit, data = null, rule = null) => {

    const inputOptionsKey = 'data-options',
        inputOptionLiteralsKey = 'data-options-literals';

    let serverLoadedOptions = rule?._option;


    let inputs = Object.entries(typ)
        .filter(([key]) => (!['created', 'updated'].includes(key)))
        .map(([key, currInput]) => {

            currInput = {...currInput, id: key, name: key}
            // console.log("KEY / INPUT", {key, formLiteral})

            if (serverLoadedOptions?.[key]) {
                currInput[inputOptionsKey] = serverLoadedOptions[key].type;
                currInput[inputOptionLiteralsKey] = serverLoadedOptions[key].lit;
            } else if (currInput[inputOptionsKey]) {
                let currLiteral = lit[key] || {}
                currInput.title = currLiteral.label || currInput.id;
                currInput[inputOptionLiteralsKey] = currLiteral.options || currInput[inputOptionsKey]
            } else {
                currInput.title = lit[key] || currInput.id
            }

            if (Array.isArray(data)) currInput["value"] = data.map(o => o[key])
            else if (data && data[key] !== undefined) currInput['value'] = data[key]
            else if (rule.value) currInput["value"] = rule.value
            // else currInput['value'] = ''

            return [key, currInput];

        })

    // if (!data && inputs[0][1].type === 'number') inputs.shift()
    if (!data && 'id' in inputs) delete inputs.id;

    let form = Object.fromEntries(inputs);

    if (rule) merge(form, rule)
    // console.log(">>>>>>>>>>> FORM :: ", form)
    return form

}


/**
 *
 * @param raw
 * @param field
 * @returns {{lit: *[], type: *[]}}
 */
export const makeOptions = (raw, field = 'name') => {
    if (!Array.isArray(raw)) raw = Object.entries(raw)
    let data = {type: [], lit: []}
    raw.forEach(o => {
        data.type.push(o.id)
        data.lit.push(o[field] || o.id)
    })
    return data;
}


export const makeEntryOptions = (entry, field = 'name') => {

    let data = {type: [], lit: []}
    Object.entries(entry)
        .forEach(([id, name]) => {
            data.type.push(parseInt(id) || id)
            data.lit.push(name || id)
        })
    return data;
}


/**
 *
 * @param url
 * @returns {[{take: (number|number)},{}]}
 */
export const resolveQueryMetaSearch = (url) => {

    if (typeof url === "string") url = new URL(url);

    let query = new URLSearchParams(url.search)

    let take = +query.get('take'),
        orderBy = query.get('order'),
        skip = +query.get('skip');

    return {
        orderBy,
        take,
        skip,
    }
}


/**
 *
 * @param url
 * @param key
 * @returns {string}
 */
export const resolveQuerySearch = (url, key = "unit_id") => {

    if (typeof url === "string") url = new URL(url);

    let query = new URLSearchParams(url.search)

    return query.get(key)

}


/**
 *
 * @param clause
 * @param qstring
 * @param search
 * @returns {*}
 */
export const resolveQuery = (clause, qstring, search = {}) => {

    // TODO: RESTORE TO 500 ENTRIES QUERY
    const def = {
        // take: 500,
        skip: 0,
        take: 550,
        orderBy: {
            id: 'asc'
        }
    }

    clause.where = search.where || {};


    clause.skip = qstring.skip || def.skip;
    clause.take = qstring.take || def.take;
    clause.orderBy = qstring.orderBy ? Object.fromEntries([qstring.orderBy.split("-")]) : def.orderBy;

    return clause;
}


/**
 *
 * @param where
 * @returns {{where}}
 */
export const metaClause = ({where}) => {
    return {where};
};


/**
 *
 * @param clause
 * @param sizeCurr
 * @param sizeAll
 * @returns {{sizeall, take, search, size, skip, order}}
 */
export const makeMeta = (clause, sizeCurr, sizeAll) => {
    let {where: search, take, skip, orderBy: order} = clause,
        count = 0, pack = [];
    console.log("==========================", search)
    if (!(search && Object.values(search)[0])) return [];

    const recur = (o) => {
        count++;
        if (count > 10) {
            console.log("ERRRRRRR: RECURSIVE SEARCH PARAMS RUN MORE TIMES THAN EXPECTED .. ")
            return ['fak', 'ap']
        }
        let [key, val] = Object.entries(o).pop()
        if (typeof val !== 'object') return pack = [key, val]
        recur(val)
    }

    recur(search);
    // console.log(">>>>>>>>>>>> META SEARCH  ** ", pack)

    return {
        search: pack, take, skip, order, size: sizeCurr, sizeall: sizeAll
    }
}


/**
 *
 * @param link
 * @returns {*|string}
 */
export const resolveClassBack = (link) => (link.includes("/install") && 'r2wx-gold-wrap')
    || (link.includes("/freon") && 'r2wx-blue-wrap')
    || (link.includes("/service") && 'r2wx-orange-wrap')
    || (link.includes("/damage") && 'r2wx-red-wrap')
    || 'r2wx-green-wrap'


/**
 *
 * @param link
 * @returns {*|string}
 */
export const resolveClassFont = (link) => (link.includes("/install") && 'r2wx-gold')
    || (link.includes("/freon") && 'r2wx-blue')
    || (link.includes("/service") && 'r2wx-orange')
    || (link.includes("/damage") && 'r2wx-red')
    || 'r2wx-green'


/**
 *
 * @returns {[*,*,*,*][]}
 */
export const toolPack = () =>
    Object.keys(TOOL)
        .map(k => {
            const [name, path, role] = PAGE[k];
            return [k.toLowerCase(), name, path, role]
        })