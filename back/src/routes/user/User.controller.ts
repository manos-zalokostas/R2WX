import {BaseController} from "@core/base/BaseController";
import {Body, Controller, Get, Post, Req,} from '@nestjs/common';
import {HTTP, PATH, VALID} from "@core/config/app.constants";
import {UserService} from "./User.service";
import {path, type, api} from "./config";
import {Request} from "express";

type RequestAuthz = Request & { userAccess?: number };

@Controller(path)
export class UserController extends BaseController {


    /**
     *
     * @param service
     */
    constructor(
        service: UserService,
    ) {
        super(
            service,
            type,
            api,
        )
    }


    /**
     *
     * @param data
     */
    @Post("authenticate")
    async authenticate(@Body() data, @Req() req: RequestAuthz) {
        try {
            // data = SAM;
            console.log(' -- API INVOKED:: POST')

            this._assureEndpointAccessible(HTTP.POST, PATH._, req.userAccess)

            this._assureDataValid(data, VALID.STRICT);

            const user = await this.service.findFirst(data);

            return user;

        } catch (error) {
            console.log({error})
            return {error}
        }
    }
}
