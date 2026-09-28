import {StatCategoryController} from "@route/stat_category/StatCategory.controller";
import {StatCategoryService} from "@route/stat_category/StatCategory.service";
import {Module} from '@nestjs/common';


@Module({
    controllers: [
        StatCategoryController
    ],
    providers: [
        StatCategoryService
    ],
})
export class StatCategoryModule {
}
