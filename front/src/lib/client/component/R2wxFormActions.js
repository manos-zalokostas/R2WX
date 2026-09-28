import httpClient from "$lib/httpClient.js";
import {REQ} from "$var";

/**
 *
 * @returns {Promise<void>}
 */
export const formPost = async (ctx) => {

    // console.log(" _____________________________________ MULTIPART DATA PACKAD: ", 1)
    if (!canSubmit()) return formReport();

    // let data = ctx.data || collectFormData()
    // console.log(" _____________________________________ MULTIPART DATA PACKAD: ", 2)
    let data = ctx.data || _resolveFormData()
    // console.log(" _____________________________________ MULTIPART DATA PACKAD: ", [...data])
    let res = await httpClient.post(ctx.uri, data)

    return res;

}


/**
 *
 */
export const formPut = async (ctx) => {

    if (!canSubmit()) return formReport();

    let data = ctx.data || _resolveFormData()
    delete data.id;

    let res = await httpClient.put(ctx.uri, data)

    return res;

}


const _resolveFormData = () => {
    return document.querySelector("input[type=file]")
        ? makeMultipartForm()
        : collectFormData()
}

/**
 *
 */
export const formDel = async (ctx) => {

    // let url = new URL(ctx.uri),
    //     search = new URLSearchParams(url.search);

    let res = await httpClient.delete(ctx.uri)

    return res;

}


/**
 *
 * @param target
 * @returns {{[p: string]: any}}
 */
export const collectFormData = (target = 'form.r2wx-form') => {

    let form = document.querySelector(target),
        formData = new FormData(form);

    let data = {};

    [...formData].forEach(
        ([key, val]) => {

            if (val === '\n') return;

            if (['true', 'false'].includes(val)) val = (val === 'true');

            if (parseInt(val) || parseFloat(val)) val = +val;

            if (key in data) {
                data[key] = Array.isArray(data[key]) ? [...data[key], val] : [data[key], val]
                return data
            }

            data[key] = val
        }
    )

    /*
    COLLECT 'DATEPICKERS' (CHECKBOXES **)
     */
    let bools = [...form.querySelectorAll('input[type=checkbox]')]
        .map(elem => [elem.name, elem.value])

    bools.forEach(
        ([id, val]) => data[id] = val
    )

    /*
    COLLECT 'DATEPICKERS' (DATE **)
     */
    let dates = [...form.querySelectorAll(".r2wx-proxy-id")]
        .map(o => (
            [o.id, o.querySelector('input').value])
        )

    dates.forEach(
        ([id, val]) => data[id] = val.split("-").reverse().join("-")
    )
    
    return data;
}


/**
 *
 * @param target
 */
export const makeMultipartForm = (target = 'form.r2wx-form') => {

    const form = new FormData();
    const dataMixed = collectFormData(target);
    const dataFiles = document.querySelectorAll("input[type=file]")

    Object.entries(dataMixed)
        .filter(([k, v]) => {
                if (v instanceof File) return false;
                if (v?.[0] instanceof File) return false;
                return true;
            }
        )
        .forEach(([k, v]) => form.append(k, v))

    // return

    dataFiles.forEach(elem => {
            if (!elem.files[0]) return;
            [...elem.files].forEach(file => form.append(elem.name, file, file.name))
        }
    )
    console.log(" >>>>>>>>>>>>>>>>> MULTIPART FORM USED:: ", [...form])

    return form;
}


/**
 *
 * @returns {boolean}
 */
export const canSubmit = () => {

    const elems = document.querySelectorAll("input[type=file]")
    if (elems[0]) evalFilesSubmit(elems)

    let can = document.querySelector("form.r2wx-form").checkValidity();

    return can;
}


/**
 *
 * @param elems
 */
const evalFilesSubmit = (elems) => {

    const invals = new Set();

    elems.forEach(elem => {
            if (!elem.files[0]) return;
            elem.setCustomValidity("");
            [...elem.files].forEach(file => {
                    const typesAccept = elem.accept.split(","),
                        typeFile = "." + file.name.split(".").pop();
                    // console.log({typesAccept, typeFile, sizeAccept, sizeFile})
                    if (!typesAccept.includes(typeFile) || file.size > elem.size) invals.add(elem)
                }
            )
        }
    );

    if (invals.size > 0) [...invals].forEach(
        elem => elem.setCustomValidity('INVALID FILE TYPE / SIZE')
    )
}


/**
 *
 * @param delay
 * @returns {number}
 */
export const reload = (delay = 0) => setTimeout(
    () => window.location.reload(),
    delay
)


/**
 *
 */
export const formReport = () => {

    document.querySelectorAll('fieldset[name]:invalid')
        .forEach(
            elem => elem.querySelector('label').classList.add('report')
        )
}


/**
 *
 * @param target
 */
export const clearInputReport = ({target: {id}}) => {
    let elem = document.querySelector(`[for=${id}].report`);
    elem && elem.classList.remove('report')
}


/**
 *
 */
export const clearFormReports = () => {

    let formStatus = document.querySelector('.r2wx-form-status-wrap')

    formStatus.classList.remove(REQ.ERR)

    document.querySelectorAll('label[for]')
        .forEach(label => {
            label.classList.remove("report")
        })
}


const filterEmpty = (data) => {

    data = data.filter(([k, v]) => v)

    return Object.fromEntries(data);
}


/**
 *
 * @param res
 */
export const handleSubmissionStatus = ({data}, ctx) => {

    let elem = document.querySelector('.r2wx-form-status-wrap');

    elem.classList.remove(REQ.WAIT)

    if (!data) return elem.classList.add(REQ.ERR)

    elem.classList.add(REQ.OK)
// ;
    ctx.redirect ? ctx.redirect(data.id) : reload(500)

}


/**
 *
 * @param data
 * @param action
 * @returns {string|*|null}
 */
export const isCreatingValidationMsg = (data, action) => {

    if (!action) return null

    return action(data).msg
}


export const forceSubmissionStatus = (msg) => {

    let elem = document.querySelector('.r2wx-form-status');

    elem.textContent = msg;
    elem.classList.add('failure')
}


