import {BaseService} from "@core/base/BaseService";
import {DbService} from "@core/datab/db.service";
import {Injectable} from '@nestjs/common';
import config from "./config";

const {entity} = config();

@Injectable({})
export class StatCategoryService extends BaseService {


    /**
     *
     * @param db
     */
    constructor(
        protected db: DbService,
    ) {
        super(db, entity);
    }

}