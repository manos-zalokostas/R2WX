import { Module } from '@nestjs/common';
import { MulterService } from './Multer.service';

@Module({
    providers: [MulterService],
    exports: [MulterService],
})
export class MulterModule {}