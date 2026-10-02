import {ACCESS, PATH} from "@core/config/app.constants"
import {statOwnerScheme} from "@r2wx/modules"



export default () => ({
    entity: 'OWNER',
    path: 'stat_owner',
    // @ts-ignore
    type: statOwnerScheme(),
    api: {
        GET: {
            [PATH._]: [ACCESS.GLOB],
        },
    },
})