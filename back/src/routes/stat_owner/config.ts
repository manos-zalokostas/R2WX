import {ACCESS, PATH} from "@core/config/app.constants";
import {statCategoryScheme} from "@r2wx/modules";

export const entity = 'OWNER';

export const path = 'stat_owner';

export const api = {
    GET: {
        [PATH._]: [ACCESS.GLOB],
        // [PATH.ID]: [ACCESS.GLOB],
        // [PATH.LATE]: [ACCESS.GLOB],
        // [PATH.FPREV]: [ACCESS.GLOB],
        // [PATH.FDOWN]: [ACCESS.GLOB],
    },
    // POST: {
    //     [PATH.MULTI]: [ACCESS.GLOB],
    // },
    // DELETE: {
    //     [PATH.MULTI_ID]: [ACCESS.GLOB],
    // },
}

export const type = statCategoryScheme
