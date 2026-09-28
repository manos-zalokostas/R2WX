import {ACCESS, PATH} from "@core/config/app.constants";
import {statCategoryScheme} from "@r2wx/modules";

export const entity = 'STAT_CATEGORY';

export const path = 'stat_category';

export const api = {
    GET: {
        [PATH._]: [ACCESS.GLOB],
    },
}

export const type = statCategoryScheme
