import samxScheme from "@r2wx/modules/schemes/samx/index.js";
import samxLit from "@r2wx/modules/schemes/samx/lit.js";
import {TOOL} from "$var";
import {low} from "$lib";


export default () => ({
    entity: low(TOOL.SAMX),
    typ: samxScheme,
    lit: samxLit
})


