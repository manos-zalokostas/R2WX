import {ACCESS, PATH} from "@core/config/app.constants"
import {samScheme} from "@r2wx/modules"

export default () => ({
    path: 'sam',
    entity: 'TOOL_SAM',
    // @ts-ignore
    type: samScheme(),
    api: {
        GET: {
            [PATH._]: [ACCESS.GLOB],
            [PATH.ID]: [ACCESS.GLOB],
            [PATH.LATE]: [ACCESS.GLOB],
            [PATH.FPREV]: [ACCESS.GLOB],
            [PATH.FDOWN]: [ACCESS.GLOB],
        },
        POST: {
            [PATH.MULTI]: [ACCESS.GLOB],
        },
        PUT: {
            [PATH.ID]: [ACCESS.GLOB],
        },
        DELETE: {
            [PATH.MULTI_ID]: [ACCESS.GLOB],
        },
    }

})