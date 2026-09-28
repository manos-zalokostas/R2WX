import {Global, Module} from "@nestjs/common";
import {DevtoolService} from "./devtool.service";

@Global()
@Module({
    providers: [DevtoolService],
    exports: [DevtoolService],
})
export class DevtoolModule {}
