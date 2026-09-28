import {BaseController} from "@core/base/BaseController";
import {SamxService} from "@route/samx/Samx.service";
import {Controller, Get,} from '@nestjs/common';
import {path, type, api} from "./config";


/**
 *
 */
@Controller(path)
export class SamxController extends BaseController {


    /**
     *
     * @param service
     * @param svMulter
     */
    constructor(
        service: SamxService,
    ) {
        super(
            service,
            type,
            api,
        )
    }


}
