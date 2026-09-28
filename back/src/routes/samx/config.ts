import {ACCESS, PATH} from "@core/config/app.constants";
import { samxScheme } from "@r2wx/modules";

export const entity = 'TOOL_SAMX';

export const path = 'samx';

export const api = {
    GET: {
        [PATH._]: [ACCESS.GLOB],
        [PATH.ID]: [ACCESS.GLOB],
        [PATH.LATE]: [ACCESS.GLOB],
    },
    POST: {
        [PATH._]: [ACCESS.GLOB],
    },
    DELETE: {
    },
}

export const type = samxScheme;
