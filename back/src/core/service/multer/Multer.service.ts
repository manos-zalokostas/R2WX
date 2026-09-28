import {Injectable, Req, Res} from '@nestjs/common';
import {Request, Response} from 'express';
import * as multer from 'multer';

// Define a type for our rule configuration for better type safety.
export type TFieldRule = {
    name: string;
    maxCount: number;
    size: number;
};

@Injectable()
export class MulterService {

    // This method is for your synchronous `createMulti` endpoint.
    async processHttp(
        @Req() req: Request,
        @Res() res: Response,
        rules: Record<string, TFieldRule>
    ): Promise<void> {
        const fieldDefinitions: TFieldRule[] = Object.values(rules);
        const upload = this._getMulterInstance(Math.max(...(fieldDefinitions.map(o => o.size))));
        const multerHandler = upload.fields(fieldDefinitions);
        await this._invokeMiddleware(multerHandler, req, res);
    }


    // NEW: This method is for your asynchronous `createMultiWS` endpoint.
    // It's simpler because it just accepts any file.
    async processWs(
        @Req() req: Request,
        @Res() res: Response
    ): Promise<void> {
        // Use a default generous limit.
        const upload = this._getMulterInstance(100 * 1024 * 1024); // 100MB
        const multerHandler = upload.any();
        await this._invokeMiddleware(multerHandler, req, res);
    }

    // Private helper to create the multer instance (DRY principle).
    private _getMulterInstance(maxSize: number) {
        return multer({
            dest: process.env.ENV_PATH_FILES || './uploads',
            limits: {fileSize: maxSize},
        });
    }


    /**
     * A private helper to wrap Express middleware in a Promise.
     * @param middleware The middleware function to execute.
     * @param req The Express Request object.
     * @param res The Express Response object.
     */
    private _invokeMiddleware(
        middleware: (req: Request, res: Response, next: (err?: any) => void) => void,
        req: Request,
        res: Response
    ): Promise<void> {

        return new Promise<void>((resolve, reject) => {
            middleware(req, res, (error: any) => {
                if (error) {
                    // If multer throws an error (e.g., file too large), reject the promise.
                    return reject(error);
                }
                // If the middleware completes successfully, resolve the promise.
                resolve();
            });
        });
    }
}