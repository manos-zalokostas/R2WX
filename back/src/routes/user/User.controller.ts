import {BaseController} from "@core/base/BaseController";
import {Body, Controller, Get, Post, Req,} from '@nestjs/common';
import {HTTP, PATH, VALID} from "@core/config/app.constants";
import {UserService} from "./User.service";
import {Request} from "express";
import config from "./config";

const {path, type, api} = config();

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
    @Post(PATH.AUTHN)
    async authenticate(@Body() data, @Req() req: RequestAuthz) {
        try {
            console.log(' -- API INVOKED:: POST')

            this._assureEndpointAccessible(HTTP.POST, PATH.AUTHN, req.userAccess)

            this._assureDataValid(data, VALID.STRICT);

            const user = await this.service.findFirst(data);

            return user;

        } catch (error) {
            console.log({error})
            return {error}
        }
    }
}
