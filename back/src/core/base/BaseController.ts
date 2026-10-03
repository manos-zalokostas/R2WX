import {
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    Req,
    Res,
    ParseIntPipe, Optional,
} from '@nestjs/common';
import {PATH, ERR, HTTP, VALID, ACCESS} from "@core/config/app.constants";
import {MulterService} from "@core/service/multer/Multer.service";
import {Validation} from "@core/service/validation/Validation";
import {Request, Response} from 'express';
import {join, basename} from 'path';
import {unlink} from "fs/promises";
import * as fs from 'fs';



type RequestAuthz = Request & { userAccess?: number };


/**
 *
 */
export class BaseController {

    private validate;

    constructor(
        protected service,
        protected scheme,
        protected api,
        @Optional() protected readonly svMulter?: MulterService,
    ) {
        this.validate = new Validation()
    }


    /**
     *
     */
    @Get()
    async get(@Req() req: RequestAuthz) {
        try {
            console.log(' -- API INVOKED:: GET-ALL')
            console.log(" -- AUTHZ REQUEST ROLE ==============> ", req.userAccess)

            this._assureEndpointAccessible(HTTP.GET, PATH._, req.userAccess)

            let data = await this.service.findMany();
            return {data}

        } catch (error) {
            console.log({error})
            return {error}
        }
    }


    /**
     *
     * @param evt_id
     * @param colname
     * @param file_id
     * @param res
     */
    @Get(PATH.FDOWN)
    async downloadFile(
        @Param('event_id', ParseIntPipe) evt_id: number,
        @Param('field_id') colname: string,
        @Param('file_id') file_id: string,
        @Req() req: RequestAuthz,
        @Res() res: Response,
    ) {
        console.log(" -- AUTHZ REQUEST ROLE ==============> ", req.userAccess)

        const entry = await this.service.findUnique({
            where: {id: evt_id}
        });

        if (!(entry && entry[colname])) throw ERR.FRNO

        console.log(">>>>>>>>>>>>>>>>>>> ENTRY ", entry)
        const files = entry[colname];
        console.log(">>>>>>>>>>>>>>>>>>> FILES ", files)

        const file = files.find(o => o.filename === file_id);
        console.log(">>>>>>>>>>>>>>>>>>> FILE ONE ", file)
        if (!file) throw ERR.FRNO


        const absolutePath = join(process.cwd(), file.path);

        if (!fs.existsSync(absolutePath)) throw ERR.FFNO

        return res.download(absolutePath, file.originalname);
    }


    // @Get(PATH.FPREV)
    @Get(PATH.FPREV)
    async previewFile(
        @Param('fid') fid: string,
        @Req() req: RequestAuthz,
        @Res() res: Response,
    ) {
        console.log(" -- AUTHZ REQUEST ROLE ==============> ", req.userAccess)

        const absolutePath = join(process.cwd(), 'uploads', fid);

        console.log(" ************************ FILE PATH *********", {absolutePath})

        if (!fs.existsSync(absolutePath)) throw ERR.FFNO

        return res.sendFile(absolutePath);
    }


    /**
     *
     */
    @Get(PATH.LATE)
    async getLatest(@Req() req: RequestAuthz) {

        try {
            console.log(' -- API INVOKED:: GET-LATEST')
            console.log(" -- AUTHZ REQUEST ROLE ==============> ", req.userAccess)

            this._assureEndpointAccessible(HTTP.GET, PATH.LATE, req.userAccess)

            let data = await this.service.findMany({
                orderBy: {
                    id: 'desc'
                },
                take: 5
            });

            return {data}
        } catch (error) {
            console.log({error})
            return {error}
        }
    }


    /**
     *
     * @param id
     */
    @Get(PATH.ID)
    async getID(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: RequestAuthz,
    ) {
        try {
            console.log(' -- API INVOKED:: GET-ONE')
            console.log(" -- AUTHZ REQUEST ROLE ==============> ", req.userAccess)
            this._assureEndpointAccessible(HTTP.GET, PATH.ID, req.userAccess)

            let clause = {where: {id}}
            let data = await this.service.findUnique(clause);

            return {data}
        } catch (error) {
            console.log({error})
            return {error}
        }
    }


    /**
     *
     * @param data
     */
    @Post()
    async create(@Body() data, @Req() req: RequestAuthz) {
        try {
            // data = SAM;
            console.log(' -- API INVOKED:: POST')
            console.log(" -- AUTHZ REQUEST ROLE ==============> ", req.userAccess)

            this._assureEndpointAccessible(HTTP.POST, PATH._, req.userAccess)

            this._assureDataValid(data, VALID.STRICT);

            const resp = await this.service.create(data);

            return {data: resp}

        } catch (error) {
            console.log({error})
            return {error}
        }
    }


    /**
     *
     * @param req
     * @param res
     */
    @Post(PATH.MULTI)
    async createMulti(@Req() req: RequestAuthz, @Res() res: Response) {
        // FIX #2: Declare 'files' outside the try block for access in catch.
        let files: Express.Multer.File[] = [];

        try {
            console.log(" -- AUTHZ REQUEST ROLE ==============> ", req.userAccess)

            this._assureEndpointAccessible(HTTP.POST, PATH.MULTI, req.userAccess)
            const {ruleBody, ruleFile} = this._splitRules();

            await this.svMulter.processHttp(req, res, ruleFile);

            files = Object.values(req.files || {}).flat();
            this._assureFilesValid(files, ruleFile);
            const filesMap = files.reduce((acc, f) => {
                acc[f.fieldname] = acc[f.fieldname]
                    ? [...acc[f.fieldname], f]
                    : [f];
                return acc;
            }, {});

            this._assureDataValid(req.body, VALID.STRICT, ruleBody);

            // ___serverLog({BODY: req.body, FILES: req.files});
            this.service.create({...req.body, ...filesMap});

            const data = files.map(f => f.originalname);
            return this._reply([data, null], res);
            // return this._reply(['ma+mu', null], res);

        } catch (error) {
            // FIX #4: Perform cleanup here, before calling the reply helper.
            files.forEach(file => fs.existsSync(file.path) && fs.unlinkSync(file.path));
            return this._reply([null, error], res);
        }
    }


    /**
     *
     * @param id
     * @param data
     */
    @Put(PATH.ID)
    async updateID(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: {},
        @Req() req: RequestAuthz,
    ) {
        try {
            console.log(' -- API INVOKED:: PUT-ONE')
            console.log(" -- AUTHZ REQUEST ROLE ==============> ", req.userAccess)

            this._assureEndpointAccessible(HTTP.PUT, PATH.ID, req.userAccess)

            this._assureDataValid(data, VALID.LOOSE);

            const clause = {where: {id}}
            const result = await this.service.update(data, clause);

            return {data: result}

        } catch (error) {
            console.log({error})
            return {error}
        }
    }



    /**
     * R2WX EXTENSION EXPERIMENT — GOOGLE GEMINI
     *
     * This multipart PUT flow was produced by Gemini after being
     * asked to study and reuse the existing R2WX infrastructure
     * to implement the missing multipart update path.
     *
     * Human-reviewed after generation.
     */
    @Put(PATH.MULTI_ID)
    async updateMulti(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: RequestAuthz,
        @Res() res: Response
    ) {
        let files: Express.Multer.File[] = [];

        try {
            console.log(" -- API INVOKED:: PUT-MULTIPART-ONE");
            console.log(" -- AUTHZ REQUEST ROLE ==============> ", req.userAccess);

            // 1. Invariant Access Check
            this._assureEndpointAccessible(HTTP.PUT, PATH.MULTI_ID, req.userAccess);

            // 2. Fetch existing entity to determine existing files and ensure record exists
            let clause = { where: { id } };
            const existingRecord = await this.service.findUnique(clause);
            if (!existingRecord) throw ERR.FRNO;

            // 3. Partition rules into scalar body and file definitions
            const { ruleBody, ruleFile } = this._splitRules();

            // 4. Stream and write new files via Multer
            await this.svMulter.processHttp(req, res, ruleFile);
            files = Object.values(req.files || {}).flat();

            // 5. Validate only the newly uploaded files against schema properties
            files.forEach(file => {
                const schemeCurr = ruleFile[file.fieldname];
                if (!this.validate.file(file, schemeCurr)) throw ERR.INPUT;
            });

            // 6. Map uploaded files into field arrays
            const newFilesMap = files.reduce((acc, f) => {
                acc[f.fieldname] = acc[f.fieldname] ? [...acc[f.fieldname], f] : [f];
                return acc;
            }, {});

            // 7. Validate scalar payload using LOOSE mode (supports partial updates)
            if (req.body && Object.keys(req.body).length > 0) {
                this._assureDataValid(req.body, VALID.LOOSE, ruleBody);
            }

            // 8. Handle file replacement & disk cleanup for fields that were overwritten
            const filesToUnlink: string[] = [];
            Object.keys(newFilesMap).forEach(fieldname => {
                const oldFiles = existingRecord[fieldname];
                if (Array.isArray(oldFiles)) {
                    oldFiles.forEach(oldFile => {
                        if (
                            oldFile?.path &&
                            oldFile.path.startsWith('uploads') &&
                            !oldFile.path.includes("..") &&
                            !oldFile.path.includes("FILE_DEFAULT_PDF")
                        ) {
                            filesToUnlink.push(oldFile.path);
                        }
                    });
                }
            });

            // 9. Prepare merged update payload (retain existing files if not re-uploaded)
            const updatePayload = {
                ...req.body,
                ...newFilesMap, // Overwrites updated file fields; omitted fields remain untouched
            };

            // 10. Persist update in DB and unlink superseded files
            const [updatedData] = await Promise.all([
                this.service.update(updatePayload, clause),
                ...filesToUnlink.map(path => fs.promises.unlink(path).catch(() => null))
            ]);

            return this._reply([updatedData, null], res);

        } catch (error) {
            // Rollback: Unlink any newly uploaded files if validation or DB update failed
            files.forEach(file => fs.existsSync(file.path) && fs.unlinkSync(file.path));
            return this._reply([null, error], res);
        }
    }


    /**
     *
     * @param id
     */
    @Delete(PATH.MULTI_ID)
    async deleteID(@Param('id', ParseIntPipe) id: number, @Req() req: RequestAuthz,) {
        try {
            console.log(' -- API INVOKED:: DEL-ONE')
            console.log(" -- AUTHZ REQUEST ROLE ==============> ", req.userAccess)

            this._assureEndpointAccessible(HTTP.DEL, PATH.MULTI_ID, req.userAccess)

            let clause = {where: {id}}
            let data = await this.service.findUnique(clause);
            console.log(' -- BACKEND => MULTIPART ENTRY:: ', data)

            const files = Object.values(data)
                .filter(v => Array.isArray(v))
                .flat()
                .map(o => o.path)
                .filter(str => !str.includes("FILE_DEFAULT_PDF"))

            files.forEach(file => {
                console.log(' -- BACKEND => MULTIPART ENTRY FILE:: ', basename(file), file)
                if (!file.startsWith('uploads') || file.includes("..")) throw `DANGEROUS FILE PATH: ${file}`
            })

            let result = await Promise.all([
                this.service.delete(clause),
                ...files.map(file => unlink(file))
            ])
            console.log(' -- BACKEND => MULTIPART ENTRY CLEAR:: ', result)

            return {data: {entry_id: data.id}}

        } catch (error) {
            console.log({error})
            return {error}
        }
    }


    /** @param data @param error @param res @param code */
    _reply = ([data, error], res: Response, code = 200) => {
        if (!error) return res.status(code).json({data});

        console.log({error});
        // Refinement: Send a structured error message.
        const errorMessage = error.message || error;
        return res.status(400).json({error: errorMessage});
    }


    /**
     *
     */
    _splitRules = () => {
        const rule = Object.entries(this.scheme)
            .reduce(
                (acc, [key, o]) => {
                    // @ts-ignore
                    if (o.type === 'file') acc.file[key] = {...o, name: key}
                    else acc.body[key] = o
                    return acc
                }, {
                    body: {},
                    file: {}
                }
            )

        return {
            ruleBody: rule.body,
            ruleFile: rule.file
        }
    }


    /**
     *
     * @param verb
     * @param path
     * @param userAccess
     */
    _assureEndpointAccessible(verb = HTTP.GET, path: string = PATH.ID, userAccess = ACCESS.GLOB) {

        console.log("  -- CHECK ENDPOINT-ACCESSIBILITY")

        this._assureEndpointExposed(verb, path)

        this._assureUserAuthorized(verb, path, userAccess)

    }



    /**
     *
     * @param verb
     * @param path
     */
    _assureEndpointExposed(verb = HTTP.GET, path: string = PATH.ID) {
        console.log("  -- CHECK:: ENDPOINT EXPOSED")

        if (!(verb in this.api)) throw ERR.VERB;

        const _PATHS = Object.keys(this.api[verb]);

        if (!_PATHS.includes(path)) throw ERR.PATH;

        console.log("  => ASSURED ENDPOINT EXPOSED")
    }


    /**
     *
     * @param verb
     * @param path
     * @param userAccess
     */
    _assureUserAuthorized(verb = HTTP.GET, path: string = PATH.ID, userAccess: number = ACCESS.GLOB) {
        console.log("  -- CHECK:: USER AUTHORIZED")

        if (!(isFinite(userAccess))) throw ERR.ACCESS + " " + 1
        userAccess = +userAccess

        const access = this.api?.[verb]?.[path]
        if (!(Array.isArray(access) && access?.[0])) throw ERR.ACCESS + " " + 2

        if (userAccess === ACCESS.GLOB) return true;

        const ACCESS_MIN = Math.min(...access)

        if (!(userAccess >= ACCESS_MIN)) throw ERR.ACCESS + " " + 3

        console.log("  => ASSURED:: USER AUTHORIZED")
    }


    /**
     *
     * @param data
     * @param type
     */
    _assureDataValid(data, type = VALID.STRICT, schemeForced = null) {

        const schemeCurr = schemeForced ? schemeForced : this.scheme;

        if (!this.validate[type](data, schemeCurr)) throw ERR.INPUT

    }



    /**
     *
     * @private
     */
    async _loadSchemeOptions(dict) {

        const deps = await Promise.all(
            Object.values(dict).map(
                // @ts-ignore
                sv => sv.findMany({})
            )
        )

        console.log(" __________________________ DEPENDENCIES LOADED ___________________")
        console.log(JSON.stringify(deps))

        Object.entries(dict)
            .forEach(
                ([key, sv], i) => {
                    dict[key] = deps[i].map(({id}) => id)
                }
            )

        console.log(" __________________________ DICTIONARY DATA FILLED ___________________")
        console.log(JSON.stringify(dict))

        const schemeNext = {
            ...this.scheme,
            ...Object.entries(dict)
                .reduce(
                    (acc, [key, data]) => {
                        acc[key] = {
                            ...this.scheme[key],
                            ['data-options']: data
                        };
                        return acc;
                    }, {}
                )
        }

        console.log(" __________________________ SCHEME-FORCED CREATED ___________________")
        console.log(JSON.stringify(schemeNext))

        return schemeNext;
    }


    /**
     *
     * @param files
     * @param scheme
     */
    _assureFilesValid(files, scheme) {

        console.log("\n\n __INIT__ :: ** FILE ** VALIDATION STARTS \n")

        console.log(" -- CHECK:: VALIDATE ALL REQUIRED FILES ARE AVAILABLE ")

        Object.entries(scheme)
            .forEach(
                ([k, rule]) => {
                    const file = files.find(f => f.fieldname === k)
                    // ZERO-LOOP HYDRATION FOR FILES:
                    // Injects the default file directly into files!
                    // @ts-ignore
                    if (!file && !rule.required && ('value' in rule)) files.push(...rule.value);

                    // @ts-ignore
                    if (rule.required && !file) throw ERR.FREQ + k

                }
            )
        console.log(" =>  ASSURED:: ALL REQUIRED FILES ARE AVAILABLE ")


        console.log(" -- CHECK:: VALIDATE FILES PROPERTIES ")
        files.forEach(file => {
                const schemeCurr = scheme[file.fieldname]
                if (!this.validate.file(file, schemeCurr)) throw ERR.INPUT
                console.log(" -- FILE VALIDATED:: " + file.originalname + "\n")
            }
        )
        console.log(" => ASSURED:: ALL REQUIRED FILES ARE AVAILABLE ")

    }

}