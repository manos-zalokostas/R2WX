export const ROLE = {
    _DEV: 100,
    GLOB: 5,
    READ: 1,
    VISIT: -1
}


export const TOOL = {
    SAM: 'SAM',
    SAMX: 'SAMX',
}

export const PAGE = {

    STCRE: ["create record", '/entities', ROLE.GLOB],
    STLAT: ["latest records", '/events/latest', ROLE.READ],
    STSER: ["search records", '/events/search', ROLE.READ],

    TOOLA: ["available entities", '/entities', ROLE.GLOB],

    [TOOL.SAM]: ["FILES-ENABLED INPUTS ", '/entities/sam', ROLE.GLOB],
    [TOOL.SAMX]: ["VALUE-DRIVEN INPUTS ", '/entities/samx', ROLE.GLOB],

    TTDED: [" GENERIC TOOL PREVIEW ", '/entities/:tool_id/:event_id', ROLE.READ],

    AUTHE: ["", '/authenticate', ROLE.VISIT],

    APFIL: ["", '/api/files', ROLE.READ],
    APTIC: ["", '/api/ticket', ROLE.VISIT],
    APTMU: ["", '/api/:tool_id/multipart', ROLE.GLOB],

}

export const FORM = {
    ADD: 1,
    READ: 2,
    EDIT: 3,
    DEL: 4
}


export const REQ = {
    WAIT: 'progress',
    OK: 'success',
    ERR: 'failure',
    BRE: 'break',
    OUT: ''
}
