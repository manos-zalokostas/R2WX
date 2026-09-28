import {MulterService} from "@core/service/multer/Multer.service";
import {BaseController} from "@core/base/BaseController";
import {SamService} from "@route/sam/Sam.service";
import {Controller, Get,} from '@nestjs/common';
import {path, type, api} from "./config";


/**
 *
 */
@Controller(path)
export class SamController extends BaseController {


    /**
     *
     * @param service
     * @param svMulter
     */
    constructor(
        service: SamService,
        svMulter: MulterService,
    ) {
        super(
            service,
            type,
            api,
            svMulter,
        )
    }


}
