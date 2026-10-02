import {ACCESS, PATH} from "@core/config/app.constants"
import {samxScheme} from "@r2wx/modules"

export default () => ({
    path: 'samx',
    entity: 'TOOL_SAMX',
    // @ts-ignore
    type: samxScheme(),
    api: {
        GET: {
            [PATH._]: [ACCESS.GLOB],
            [PATH.ID]: [ACCESS.GLOB],
            [PATH.LATE]: [ACCESS.GLOB],
        },
        POST: {
            [PATH._]: [ACCESS.GLOB],
        },
        PUT: {
            [PATH.ID]: [ACCESS.GLOB],
        },
        DELETE: {},
    }
})