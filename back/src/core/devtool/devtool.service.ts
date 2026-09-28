import {Injectable} from "@nestjs/common";


/**
 *
 */
@Injectable({})
export class DevtoolService {


    constructor() {
    }



    async mockEDAFileProcessing(O, sessionId, files) {
        console.log(`[Worker Mock] Starting to process session: ${sessionId}`);
        const totalFiles = files.length;

        // Let's get the validation rules for files from the scheme.
        const {ruleFile} = O._splitRules();

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileIndex = i + 1;

            try {
                // 1. Emit a "starting" event for this file.
                O.eventGateway.emitUploadProgress(sessionId, {
                    sessionId,
                    status: 'processing',
                    fileName: file.originalname,
                    fileIndex,
                    totalFiles,
                });

                // 2. Simulate heavy work (e.g., DB writes, virus scanning).
                await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5-second mock processing time.

                // 3. Perform the actual validation for this file.
                // We're reusing your existing validation logic here.
                const schemeForFile = ruleFile[file.fieldname];
                if (!O.validate.file(file, schemeForFile)) {
                    throw new Error(`File '${file.originalname}' failed validation.`);
                }

                // 4. If validation passes, move the file to its final destination.
                // const finalPath = path.join(process.env.ENV_PATH_FILES, file.filename);
                // fs.renameSync(file.path, finalPath);

                // 5. After "work" is done, emit a "completed" event for this file.
                O.eventGateway.emitUploadProgress(sessionId, {
                    sessionId,
                    status: 'complete',
                    fileName: file.originalname,
                    fileIndex,
                    totalFiles,
                });

            } catch (error) {
                // 6. If a specific file fails, emit an error event for it.
                O.eventGateway.emitUploadProgress(sessionId, {
                    sessionId,
                    status: 'error',
                    fileName: file.originalname,
                    fileIndex,
                    totalFiles,
                    error: error.message,
                });
                // In a real system, you might stop here or continue with other files.
                // For now, we'll just log it and continue.
                console.error(`[Worker Mock] Error processing ${file.originalname}: ${error.message}`);
            }
        }

        // 7. After all files are attempted, emit a final "all_done" event.
        O.eventGateway.emitUploadProgress(sessionId, {
            sessionId,
            status: 'all_done',
            message: 'All files have been processed.',
        });

        console.log(`[Worker Mock] Finished processing session: ${sessionId}`);
        // You might want a separate cleanup job for the temp files.
    }

}

