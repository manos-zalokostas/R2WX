import {StatOwnerController} from "@route/stat_owner/StatOwner.controller";
import {StatOwnerService} from "@route/stat_owner/StatOwner.service";
import {Module} from '@nestjs/common';



@Module({
    controllers: [
        StatOwnerController
    ],
    providers: [
        StatOwnerService,
    ],
})
export class StatOwnerModule {
}
