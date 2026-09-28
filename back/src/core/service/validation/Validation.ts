import {_T} from "@r2wx/modules"

const _array = v => Array.isArray(v)
const _string = v => typeof v === 'string';
const _bool = v => typeof v === 'boolean';
const _float = v => _exists(v) && isFinite(v)
const _object = v => typeof v === 'object' && v !== null;
const _num = v => typeof v === 'number' && isFinite(v);
const _exists = v => v !== null && v !== undefined && v !== ''
const _max = (v, r) => _num(v) && v <= r
const _min = (v, r) => _num(v) && v >= r
const _mal = (v, r) => _string(v) && _max(v.length, r)
const _mil = (v, r) => _string(v) && _min(v.length, r)
const _date = v => !isNaN(Date.parse(v));
const _patt = (v, patt) => {
    console.log(" ++++++++++++++++++++++++++++++++++++++++++++++ PAT - RAT")
    return !!v.match(patt)?.[0]
}
const _list = (v, r) => _array(r) && r.includes(v)
const _floatFormat = v => ('' + v).includes('.')
const _step = (v, r = 2) => {

    // CASE INTEGERS
    if (!_floatFormat(r)) return !(v % r)

    // CASE DECIMALS ( COVERT TO INTEGERS )
    let decimals = ('' + r).split(".").pop().length,
        multiply = +(1 + new Array(decimals).fill(0).join(""));
    const vm = Math.round(v * multiply),
        rm = Math.round(v * multiply);

    return !(vm % rm)
}


/*

 */
const CHECK = {

    // CORE TYPES
    STRI: (v) => [
        _string(v),
        `NOT A STRING => ${v}`
    ],
    NUMB: (v) => [
        _num(v),
        `NOT A NUMBER => ${v}`
    ],
    FLOA: (v) => [
        _float(v),
        `NOT A FLOAT => ${v}`
    ],
    DATE: (v) => [
        _date(v),
        `NOT A DATE => ${v}`
    ],
    BOOL: (v) => [
        _bool(v),
        `NOT A BOOLEAN => ${v}`
    ],
    EXIS: (v) => [
        _exists(v),
        `NOT A VALUE => ${v}`
    ],
    MINI: (v, r = 0.0) => [
        _min(v, r),
        `NOT ABOVE MIN => ${v} > ${r}`
    ],
    MAXI: (v, r = 1000.0) => [
        _max(v, r),
        `NOT BELOW MAX => ${v} < ${r}`
    ],
    MINL: (v, r = 3) => [
        _mil(v, r),
        `NOT ABOVE MIN-LENGTH => ${v} > ${r}`
    ],
    MAXL: (v, r = 191) => [
        _mal(v, r),
        `NOT BELOW MAX-LENGTH => ${v} < ${r}`
    ],
    PATT: (v, r = ".*") => [
        _patt(v, r),
        `NOT PATTERN MATCHING => ${v} :: ${r}`
    ],
    STEP: (v, r = 2) => [
        _step(v, r),
        `NOT STEPPING CORRECT => ${v} :: ${r}`
    ],
    LIST: (v, r = []) => [
        _list(v, r),
        `NOT WHITELISTED => ${v} :: ${r}`
    ],
    FILE: (f: { originalname: '', size: 100 }, r = {accept: [], size: 100}) => [
        _string(f.originalname) && r.accept.includes("." + f.originalname.split(".").pop()) && r.size >= f.size,
        `NOT VALID FILE => ${f.originalname} :: ${r.accept} :: ${r.size}`
    ]


}


/*

 */
const TMAP = {
    // CORE
    [_T.TEXT]: CHECK.STRI,
    [_T.NUMB]: CHECK.NUMB,
    [_T.FLOA]: CHECK.FLOA,
    [_T.DATE]: CHECK.DATE,
    [_T.FILE]: CHECK.FILE,
    // TRAITS
    "required": CHECK.EXIS,
    "min": CHECK.MINI,
    "max": CHECK.MAXI,
    "step": CHECK.STEP,
    "pattern": CHECK.PATT,
    "maxLength": CHECK.MAXL,
    "minLength": CHECK.MINL,
    // ALIASES
    [_T.TEXA]: CHECK.STRI,
    [_T.SWIT]: CHECK.LIST,
    [_T.SWIG]: CHECK.LIST,
    [_T.CHEB]: CHECK.LIST,
    [_T.SELE]: CHECK.LIST,
    [_T.SELM]: CHECK.LIST,
    [_T.RADI]: CHECK.LIST,

    [_T.EMAI]: CHECK.STRI,
    [_T.PASW]: CHECK.STRI,

    "data-options": CHECK.LIST
}


/**
 *
 * @param valueCurr
 * @param attrKey
 * @param r
 * @constructor
 */
const TMAP_EVAL = (valueCurr, attrKey, r = null) => {
    if (!(attrKey in TMAP)) throw 'NO TYPE EVALUATION AVAILABLE';

    const action = TMAP[attrKey];
    // @ts-ignore
    const [result, msg] = r ? action(valueCurr, r) : action(valueCurr);

    if (result !== false) return result
    throw msg;
}


/**
 *
 * @param v
 * @param type
 * @constructor
 */
const CAST = (v, type) => {
    // 1. SAFEGUARD: If it doesn't exist, leave it alone (undefined stays undefined!)
    if (!_exists(v)) return v;

    if ([_T.DATE].includes(type)) return (new Date(v)).toISOString();
    if ([_T.NUMB, _T.FLOA].includes(type)) return +v;

    // 2. BOOLEAN STRING CONVERSION
    if (['true', 'false'].includes(v)) return v === 'true';

    // 3. SAFE RETURN: Return original value (don't force '' + v)
    return v;
}


/**
 *
 */
export class Validation {

    scheme = {}
    #data = {}

    validExcludes = [
        'type',
        'title',
        'value',
        'checked',
        'placeholder',
    ]

    constructor(scheme = {}) {
        this.scheme = scheme;
    }


    /**
     *
     * @param type
     * @param staticRule
     * @param valueCurr
     */
    _evalType(key, staticRule) {

        let valueCurr = this.#data[key];
        console.log(" -- CORE-TYPE EXAMINED", {valueCurr, key, ruleType: staticRule.type})
        if (('data-options' in staticRule)) return console.log(" -- CORE-TYPE:: COMPLEX => SKIP AND EXAMINE NEXT W/ 'DATA-OPTIONS")

        // --- ZERO-LOOP HYDRATION ---
        if (!staticRule.required && !_exists(valueCurr)) {
            if ('value' in staticRule) valueCurr = staticRule.value; // Hydrate from schema default!
            else return console.log(" -- CORE-TYPE:: SKIPPED AS NON-REQUIRED AND EMPTY");
        }
        // ----------------------------

        if (staticRule.required && !_exists(valueCurr)) throw " -- CORE-TYPE:: REQUIRED BUT EMPTY"

        console.log("_______________________ TYPE BEFO:: ", {valueCurr, type: typeof valueCurr})
        const valueNext = CAST(valueCurr, staticRule.type)

        console.log("_______________________ TYPE AFTE:: ", {valueNext, type: typeof valueNext})
        TMAP_EVAL(valueNext, staticRule.type)

        this.#data[key] = valueNext;
    }


    /**
     *
     * @param key
     * @param staticRule
     * @param currExcludes
     */
    _evalAttrs(key, staticRule, currExcludes = []) {

        const valueCurr = this.#data[key]
        Object.entries(staticRule)

            .filter(([attrKey, attrValue]) => !currExcludes.includes(attrKey))

            .forEach(([attrKey, attrValue]) => {

                    if (!staticRule.required && !valueCurr) return console.log(" -- ATTR:: SKIPPED AS NON-REQUIRED AND EMPTY'")

                    console.log(" -- ATTR EXAMINED", {valueCurr, attrKey, attrValue})

                    TMAP_EVAL(valueCurr, attrKey, attrValue)

                }
            )
    }


    /**
     *
     * @param data
     * @param scheme
     * @param optionalExcludes
     */
    strict(data: {}, scheme: {}, optionalExcludes = []) {
        try {
            console.log(" __INIT__ :: ** STRICT ** VALIDATION ENABLED ")
            this.#data = data;

            const currExcludes = [
                ...this.validExcludes,
                ...optionalExcludes
            ]

            Object.entries(scheme)
                .forEach(([key, rule]) => {
                        console.log("")
                        console.log("")
                        console.log(` ** RULES LOOPING =>  KEY="${key}" + VAL="${data[key]}"`)
                        console.log("============================================================")
                        console.log("  >> RULE SCHEME::   ", rule)
                        console.log(" -----------------------")

                        this._evalType(key, rule)
                        console.log(" -- ATTRS LOOP")

                        this._evalAttrs(key, rule, currExcludes)
                        console.log(" ALL RULES LOOPED => OK")

                        // @ts-ignore
                        this.#data[key] = CAST(this.#data[key], rule.type);
                    }
                )

            return true;

        } catch (e) {
            console.log(e)
            return false;
        }
    }


    /**
     *
     * @param data
     * @param scheme
     * @param optionalExcludes
     */
    loose(data: {}, scheme: {}, optionalExcludes = []) {
        try {
            console.log(" __INIT__ :: ** LOOSE ** VALIDATION ENABLED ")

            const currExcludes = [
                ...this.validExcludes,
                ...optionalExcludes
            ]

            let schemeLoose = {};
            const keys = Object.keys(data)
                .filter(key => !(['id'].includes(key)))

            keys.forEach(key => {

                    if (key in scheme) return schemeLoose[key] = scheme[key];

                    console.log(" ERR:: INVALID SCHEME PUSHED", {key, dataPushed: data, validSchemeKeys: keys})
                    throw `ERR:: INVALID SCHEME PUSHED:: KEY => "${key}" INVALID`
                }
            )

            console.log("  -- LOOSE-SCHEME CREATED AND WILL PROCESS FURTHER", {schemeLoose})

            return this.strict(data, schemeLoose, currExcludes)

        } catch (e) {
            console.log(e)
            return false;
        }
    }


    /**
     *
     * @param data
     * @param scheme
     * @param optionalExcludes
     */
    file(data: {}, scheme: {}, optionalExcludes = []) {
        try {


            const currExcludes = [
                ...this.validExcludes,
                ...optionalExcludes
            ]

            /*
      fieldname: 'input_2',
      originalname: 'EXCEL_SAM.xls',
      encoding: '7bit',
      mimetype: 'application/vnd.ms-excel',
      destination: './uploads',
      filename: '8e44ca7e1c70fb2fd092ac2aafd124de',
      path: 'uploads/8e44ca7e1c70fb2fd092ac2aafd124de',
      size: 4597
 */
            // @ts-ignore
            console.log(` ** FILE EVAL =>  name="${data.fieldname}" + VAL="${data.originalname}"`)
            console.log("============================================================")
            console.log("  >> RULE SCHEME::   ", scheme)
            console.log(" -----------------------")
            console.log("  ++ FILE INFO::   ", data)
            console.log(" ----------------------- ")

            // @ts-ignore
            const [result, msg] = CHECK.FILE(data, scheme)

            if (result !== false) return result
            throw msg;

        } catch (e) {
            console.log(e)
            return false;
        }
    }


}
