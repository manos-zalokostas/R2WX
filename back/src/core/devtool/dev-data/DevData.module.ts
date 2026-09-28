import {Global, Module} from '@nestjs/common';
import {DevDataParsedService} from "./DevDataParsed.service";
import {DevDataRawService} from "./DevDataRaw.service";

@Global()
@Module({
    providers: [
        DevDataParsedService,
        DevDataRawService,
    ],
    exports: [
        DevDataParsedService,
        DevDataRawService,
    ]
})
export class DevDataModule {
}
