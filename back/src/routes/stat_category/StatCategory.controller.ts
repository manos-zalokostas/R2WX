import {StatCategoryService} from "@route/stat_category/StatCategory.service";
import {BaseController} from "@core/base/BaseController";
import {Controller, Get,} from '@nestjs/common';
import {path, type, api} from "./config";


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
