import {SamxController} from "@route/samx/Samx.controller";
import {SamxService} from "@route/samx/Samx.service";
import {Module} from '@nestjs/common';
import {StatCategoryService} from "@route/stat_category/StatCategory.service";
import {StatOwnerService} from "@route/stat_owner/StatOwner.service";



@Module({
    controllers: [SamxController],
    providers: [
        SamxService,
        StatCategoryService,
        StatOwnerService,
    ],
})
export class SamxModule {
}
