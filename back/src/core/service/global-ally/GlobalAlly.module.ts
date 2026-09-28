import {GlobalAllyService} from "./GlobalAlly.service";
import {Global, Module} from '@nestjs/common';

@Global()
@Module({
    providers: [
        GlobalAllyService,
    ],
    exports: [GlobalAllyService],
})
export class GlobalAllyModule {
}
