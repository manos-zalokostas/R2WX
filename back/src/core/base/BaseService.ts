import {Body, Injectable, Module} from '@nestjs/common';
import {DbService} from "@core/datab/db.service";

@Injectable({})
export class BaseService {

    model = null;

    /**
     *
     * @param entity
     * @param db
     */
    constructor(
        protected db: DbService,
        protected entity: string,
    ) {
        this.model = db[entity]
    }


    /**
     *
     * @param entry
     * @returns {Promise<*|undefined|{}>}
     */
    async create(entry = {}) {
        return await this.model.create({data: entry})
    }


    /**
     *
     * @param entries
     */
    async createMany(entries = []) {
        return await this.model.createMany({data: entries})
    }


    /**
     *
     * @param clause
     */
    async findMany(clause: {}) {
        return await this.model.findMany(clause)
    }


    /**
     *
     * @param clause
     */
    async findUnique(clause: {}) {
        return await this.model.findUnique(clause)
    }


    /**
     *
     * @param clause
     */
    async findFirst(clause: {}) {
        return await this.model.findFirst(clause)
    }


    /**
     *
     * @param data
     * @param clause
     */
    async update(data: {}, clause: {}) {
        return await this.model.update({data, ...clause})
    }


    /**
     *
     * @param data
     * @param clause
     */
    async updateMany(data: {}, clause: {}) {
        return await this.model.updateMany({data, ...clause})
    }


    /**
     *
     * @param clause
     */
    async delete(clause: {}) {
        return await this.model.delete(clause)
    }


    /**
     *
     * @param clause
     */
    async deleteMany(clause: {}) {
        return await this.model.deleteMany(clause)
    }


}
