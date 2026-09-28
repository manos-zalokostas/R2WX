import { Module } from '@nestjs/common';
import {IdentifierService} from "./Identifier.service";

@Module({
    providers: [IdentifierService],
    exports: [IdentifierService],
})
export class IdentifierModule {}