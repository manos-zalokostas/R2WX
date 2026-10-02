import {ACCESS, PATH} from "@core/config/app.constants";
import {statCategoryScheme} from "@r2wx/modules";


export default () => ({
 path : 'stat_category',
 entity : 'STAT_CATEGORY',
    // @ts-ignore
 type : statCategoryScheme(),
 api : {
    GET: {
        [PATH._]: [ACCESS.GLOB],
    },
},
})
