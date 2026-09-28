export const PATH = {
    _: "_",
    ID: ':id',
    LATE: 'latest',
    ID_LIST: "list/:ids",

    MULTI: "multipart",
    FPREV: "preview/:fid",
    MULWS: 'multipart-ws',
    MULTI_ID: 'multipart/:id',
    FDOWN: ":event_id/type/:field_id/files/:file_id",

    AUTHN: 'authenticate',
    AUTHZ: 'authorize',
}

export const ACCESS = {
    GLOB: 5,
    CREA: 4,
    DELE: 3,
    EDIT: 2,
    READ: 1,
    VISIT: -1,
}

export const ERR = {
    INPUT: 'INVALID INPUT',
    VERB: 'INVALID HTTP METHOD',
    PATH: 'INVALID REQUEST PATH',
    ACCESS: 'INVALID ACCESS LEVEL',
    WSOC: 'INVALID WS CONFIGURATION',
    FREQ: 'REQUIRED FILE MISSING',
    FSIZE: 'INVALID FILE SIZE',
    FRNO: 'File record not found',
    FFNO: 'Physical file not found on server',
}


export const HTTP = {
    POST: 'POST',
    DEL: 'DELETE',
    PUT: 'PUT',
    GET: 'GET',
}

export const VALID = {
    STRICT: 'strict',
    LOOSE: 'loose',
}