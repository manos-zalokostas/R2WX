import {ACCESS, PATH} from "@core/config/app.constants";
import { samScheme } from "@r2wx/modules";

export const entity = 'TOOL_SAM';

export const path = 'sam';

export const api = {
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
    DELETE: {
        [PATH.MULTI_ID]: [ACCESS.GLOB],
    },
}

export const type = samScheme;
