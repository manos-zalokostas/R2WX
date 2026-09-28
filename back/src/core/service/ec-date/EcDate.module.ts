import {Global, Module} from '@nestjs/common';

@Global()
@Module({
    providers: [
        EcDateModule,
    ],
    exports: [
        EcDateModule,
    ]
})
export class EcDateModule {
}
