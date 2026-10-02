import {StatCategoryService} from "@route/stat_category/StatCategory.service";
import {BaseController} from "@core/base/BaseController";
import {Controller, Get,} from '@nestjs/common';
import config from "./config";


const {path, type, api} = config();


/**
 *
 */
@Controller(path)
export class StatCategoryController extends BaseController {


    /**
     *
     * @param service
     */
    constructor(
        service: StatCategoryService,
    ) {
        super(
            service,
            type,
            api,
        )
    }


}
