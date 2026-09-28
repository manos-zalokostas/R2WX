import {inspect} from "node:util";


export const __DEV_SERVER_LOG = (o) => console.log(" -- SERVER--DEEP-LOG >>>>>>>>>>", inspect(o, null, null, true));

