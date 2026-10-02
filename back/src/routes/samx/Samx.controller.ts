import {BaseController} from "@core/base/BaseController";
import {SamxService} from "@route/samx/Samx.service";
import {Body, Controller, Get, Post, Req,} from '@nestjs/common';
import config from "./config";
import {HTTP, PATH, VALID} from "@core/config/app.constants";
import {Request} from "express";
import {StatCategoryService} from "@route/stat_category/StatCategory.service";
import {StatOwnerService} from "@route/stat_owner/StatOwner.service";

type RequestAuthz = Request & { userAccess?: number };


const {path, type, api} = config();

/**
 *
 */
@Controller(path)
export class SamxController extends BaseController {


    /**
     *
     * @param sv
     * @param svOwner
     * @param svCategory
     */
    constructor(
        sv: SamxService,
        private readonly svOwner: StatOwnerService,
        private readonly svCategory: StatCategoryService,
    ) {
        super(
            sv,
            type,
            api,
        )
    }


    /**
     *
     * @param data
     */
    @Post()
    async create(@Body() data, @Req() req: RequestAuthz) {
        try {

            console.log(' -- API INVOKED:: POST [SAMX OVERRIDE]')
            console.log(" -- AUTHZ REQUEST ROLE ==============> ", req.userAccess)

            this._assureEndpointAccessible(HTTP.POST, PATH._, req.userAccess)

            const schemeNext = await this._loadSchemeOptions({
                owner_id: this.svOwner,
                category_id: this.svCategory,
            });

            this._assureDataValid(data, VALID.STRICT, schemeNext);

            const resp = await this.service.create(data);

            return {data: resp}

        } catch (error) {
            console.log({error})
            return {error}
        }
    }


}
