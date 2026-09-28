import {SamxController} from "@route/samx/Samx.controller";
import {SamxService} from "@route/samx/Samx.service";
import {Module} from '@nestjs/common';



@Module({
    controllers: [SamxController],
    providers: [
        SamxService,
        // MulterService,
    ],
})
export class SamxModule {
}
