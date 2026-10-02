import {StatCategoryModule} from "@route/stat_category/StatCategory.module";
import {StatOwnerModule} from "@route/stat_owner/StatOwner.module";
import {MulterModule} from "@core/service/multer/Multer.module";
import {SamxModule} from "@route/samx/Samx.module";
import {UserModule} from "@route/user/User.module";
import {SamModule} from "@route/sam/Sam.module";
import {DbModule} from '@core/datab/db.module';
import {Module} from '@nestjs/common';


/**
 *
 */
@Module({
    imports: [
        DbModule,
        MulterModule,
        UserModule,
        StatCategoryModule,
        StatOwnerModule,
        SamModule,
        SamxModule,
    ],
})

export class AppModule {
}
