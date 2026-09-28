import {StatOwnerService} from "@route/stat_owner/StatOwner.service";
import {BaseController} from "@core/base/BaseController";
import {Controller, Get,} from '@nestjs/common';
import {path, type, api} from "./config";


/**
 *
 */
@Controller(path)
export class StatOwnerController extends BaseController {


    /**
     *
     * @param service
     * @param svMulter
     */
    constructor(
        service: StatOwnerService,
    ) {
        super(
            service,
            type,
            api,
        )
    }


}
