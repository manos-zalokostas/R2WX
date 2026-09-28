import Configuration from "@core/config/configuration";
import {DevtoolModule} from "@core/devtool/devtool.module";
import {DevDataModule} from "@core/devtool/dev-data/DevData.module";
import {EcDateModule} from "@core/service/ec-date/EcDate.module";
import {MulterModule} from "@core/service/multer/Multer.module";
import {EventModule} from "@core/event/event.module";
import {UserModule} from "@route/user/User.module";
import {ServeStaticModule} from '@nestjs/serve-static';
import {SamModule} from "@route/sam/Sam.module";
import {DbModule} from '@core/datab/db.module';
import {ConfigModule} from "@nestjs/config";
import {Module} from '@nestjs/common';
import {join} from "path"

import {StatCategoryModule} from "@route/stat_category/StatCategory.module";
import {StatOwnerModule} from "@route/stat_owner/StatOwner.module";
import {SamxModule} from "@route/samx/Samx.module";

/**
 *
 */
@Module({
    imports: [
        ConfigModule.forRoot({
            load: [Configuration],
            isGlobal: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../..', 'public'),
        }),
        DbModule,
        EcDateModule,
        EventModule,
        MulterModule,

        UserModule,

        DevDataModule,
        DevtoolModule,

        StatCategoryModule,
        StatOwnerModule,

        SamModule,
        SamxModule,
    ],
})

export class AppModule {
}
