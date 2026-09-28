import {samScheme, samLit} from "@r2wx/modules";
import {TOOL} from "$var";
import {low} from "$lib";


export default () => ({
    entity: low(TOOL.SAM),
    typ: samScheme,
    lit: samLit
})


