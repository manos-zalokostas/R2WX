import {Module} from '@nestjs/common';
import {MulterService} from "@core/service/multer/Multer.service";
import {SamController} from "@route/sam/Sam.controller";
import {SamService} from "@route/sam/Sam.service";



@Module({
    controllers: [SamController],
    providers: [
        SamService,
        MulterService,
    ],
})
export class SamModule {
}
