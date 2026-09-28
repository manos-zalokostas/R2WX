import {ACCESS, PATH} from "@core/config/app.constants";
import {T} from "@r2wx/modules";

export const entity = 'APP_USER';

export const path = 'user';


export const api = {
    // GET: {
    //     [PATH._]: [ACCESS.VISIT],
    // },
    POST: {
        [PATH._]: [ACCESS.VISIT],
        ['authenticate']: [ACCESS.VISIT],
    },
}

export const type = {
    "email": T.EMAI,
    "pass": T.PASW,
};
