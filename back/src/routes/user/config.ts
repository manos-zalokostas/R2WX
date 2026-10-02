import {ACCESS, PATH} from "@core/config/app.constants"
import {T, userAuthScheme} from "@r2wx/modules"

export default () => ({
    path: 'user',
    entity: 'APP_USER',
    // @ts-ignore
    type: userAuthScheme(),
    api: {
        POST: {
            [PATH.AUTHN]: [ACCESS.VISIT],
        },
    }

})