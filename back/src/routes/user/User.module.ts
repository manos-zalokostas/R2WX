import {IdentifierService} from "@core/service/identifier/Identifier.service";
import {UserController} from "./User.controller";
import {UserService} from "./User.service";
import {Module} from '@nestjs/common';


@Module({
    controllers: [UserController],
    providers: [
        UserService,
        IdentifierService,
    ]
})


export class UserModule {
}
