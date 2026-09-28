import {Body, Injectable, Module} from '@nestjs/common';


@Injectable({})
export class DevDataParsedService {


    /**
     *
     */
    constructor() {
    }

    get() {
        return {
            devdata: {a: 1, b:2}
        }
    }

}