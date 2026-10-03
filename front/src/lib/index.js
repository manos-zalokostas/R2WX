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


/**
 *
 * @param t
 * @return {string|string}
 */
export const low = (t) => t && t.toLowerCase() || ''


/**
 *
 * @param t
 * @return {string|string}
 */
export const upp = (t) => t && t.toUpperCase() || ''


/*
 *
 * @param a
 * @returns {string}
 */
export const apiPath = (...a) => {

    let link = ['api', ...a].join("/");
    link = link.replaceAll("//", "/");

    return link;
}


/**
 *
 * @param a
 * @returns {string}
 */
export const apiUrl = (...a) => {

    let link = [PUBLIC_APPSERVER, 'api', ...a].join("/");

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
 * @param form
 * @param rule
 */
export const merge = (form, rule = {}) => {
    Object.entries(form)
        .forEach(
            ([key, entry]) => {
                if (key in rule) form[key] = {...entry, ...rule[key]}
            }
        )

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