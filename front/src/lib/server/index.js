import {ENV_DATASERVER, ENV_SECRET} from "$env/static/private"
import {schemaMod} from "$lib";


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


/*

 */
export const _staticFiles = async (dir, lang, ...attrs) => {

    let type, literal;
    const pack = [
        import(/* @vite-ignore */_addressTyp(dir)),
        import(/* @vite-ignore */_addressLit(dir, lang)),
    ]
    if (attrs[0]) pack.push(import(/* @vite-ignore */_addressMod(dir)))

    let [moduleType, moduleLit, moduleNext] = await Promise.all(pack)

    moduleType = structuredClone(moduleType.default)
    literal = structuredClone(moduleLit.default);
    type = moduleNext
        ? schemaMod(moduleType, moduleNext.default.type, ...attrs)
        : moduleType;

    return [type, literal];

}


/**
 *
 * @param dir
 * @returns {string}
 */
export const _addressTyp = (dir) => {

    let path = [process.env.PWD, "/src/lit/entity", dir, "type.js"].join("/");

    return path;
}


/**
 *
 * @param dir
 * @returns {string}
 */
export const _addressMod = (dir) => {

    let path = [process.env.PWD, "/src/lit/entity-mod", dir, "mod.js"].join("/");

    return path;
}


/**
 *
 * @param dir
 * @param lang
 * @returns {string}
 */
export const _addressLit = (dir, lang = '') => {

    let file = 'lit';

    if (lang) file += "_" + lang

    let path = [process.env.PWD, "/src/lit/entity", dir, file + ".js"].join("/");

    return path
}


/**
 *
 * @param lang
 * @param filename
 * @returns {string}
 */
export const _addressGlob = (lang, filename) => {
    if (lang) filename += "_" + lang
    return [process.env.PWD, "src", filename + ".js"].join("/");
}


/**
 *
 * @param lang
 * @param filepath
 * @param filename
 * @returns {string}
 */
export const _address = (lang, filepath = "", filename = "lit") => {
    if (lang) filename += "_" + lang
    return process.env.PWD + "/src/lit/" + filepath + "/" + filename + ".js";
}


/**
 *
 * @param ctx
 * @param fn
 * @returns {Promise<Response|{error}>}
 */
export const _dispatch = async (ctx, fn = () => ({})) => {
    try {

        const data = await fn();

        const res = _reply({data})

        return res;

    } catch (error) {
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", error)
        return _reply({error})
    }
}
