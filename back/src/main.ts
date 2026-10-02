import {AuthzGuard} from "@core/service/authz/Authz";
import { existsSync, mkdirSync } from 'fs';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as process from 'node:process';

async function bootstrap() {
    const PATH_F = process.env.ENV_PATH_FILES,
        PATH_FT = process.env.ENV_PATH_FILES_TMP,
        PORT = +process.env.ENV_APPPORT

    console.log(PATH_F, PATH_FT, existsSync)
    if (!existsSync(PATH_F)) mkdirSync(PATH_F, {recursive: true});
    if (!existsSync(PATH_FT)) mkdirSync(PATH_FT, {recursive: true});

    const app = await NestFactory.create(AppModule);

    app.useGlobalGuards(new AuthzGuard());

    app.enableCors();
    await app.listen(PORT);

    console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
