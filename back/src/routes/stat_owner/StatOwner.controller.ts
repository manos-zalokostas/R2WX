import {StatOwnerService} from "@route/stat_owner/StatOwner.service";
import {BaseController} from "@core/base/BaseController";
import {Controller, Get,} from '@nestjs/common';
import config from "./config";

const {path, type, api} = config();

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
