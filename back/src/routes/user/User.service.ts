import {IdentifierService} from "@core/service/identifier/Identifier.service";
import {BaseService} from "@core/base/BaseService";
import {DbService} from "@core/datab/db.service";
import {Injectable} from '@nestjs/common';
import {entity} from "@route/user/config";


@Injectable({})
export class UserService extends BaseService {


    /**
     *
     * @param db
     * @param svId
     */
    constructor(
        protected db: DbService,
        private svId: IdentifierService,
    ) {
        super(db, entity);
    }


    /**
     *
     * @param entry
     */
    override async create(entry) {

        console.log("____________________________________________ ENTRY", {entry})
        return await this.model.create({
            data: {
                email: entry.email,
                password: await this.svId.argon2Hash(entry.pass)
            }
        })

    }


    /**
     *
     * @param entry
     */
    override async findFirst(entry) {

        console.log("____________________________________________ ENTRY", {entry})
        const user = await this.model.findFirst({
            where: {email: entry.email},
            include: {
                APP_ACCESS: true
            }
        })
        if (!user) throw 'NO USER FOUND'

        const isAuthentic = await this.svId.argon2HashCompare(entry.pass, user.password)
        if (!isAuthentic) return null;

        delete user.password;
        return user;
    }
}