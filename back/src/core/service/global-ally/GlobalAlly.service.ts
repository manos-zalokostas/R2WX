import {Body, Injectable, Module} from '@nestjs/common';


@Injectable({})
export class GlobalAllyService {


    /**
     *
     */
    constructor() {
    }


    /**
     *
     * @param i
     */
    fillZero(i) {
        return +i > 9 ? `${i}` : `0${+i}`
    }


    /**
     *
     * @param i
     */
    hourIndex(i) {
        return 'h' + this.fillZero(i)
    }


    /**
     *
     * @param data
     */
    sortKeys(data) {
        let res = {};

        Object.keys(data)
            .sort()
            .forEach(
                key => res[key] = data[key]
            )

        return res;
    }


    /**
     *
     * @param strdate
     */
    dtid(strdate = '2024-10-08T23:00:00+00:00') {
        let [strd, strt] = strdate.split("T"),
            did = strd.replaceAll("-", ""),
            tid = strt.split(":").shift();
        return +(did.slice(2) + tid)
    }


    /**
     *
     * @param date
     */
    stepTime(date = new Date()) {
        date.setSeconds(0)
        date.setMinutes(0)
        // date.setHours(date.getHours() - 1)

        return new Array(24)
            .fill(1)
            .map((v, i) => new Date(date.setHours(date.getHours() + 1))
                .toISOString()
                .split(".")
                .shift()
                .concat("+00:00")
            )
    }


    /**
     *
     * @param raw
     */
    parseRawForecast({ts, values}) {

        const dateNext = new Date(ts);
        dateNext.setHours(dateNext.getHours() + 1);

        const tss = this.stepTime(new Date(dateNext)),
            entries = Object.values(values),
            dtids = [],
            data = [];

        tss.forEach((t, i) => {
            let dtid = this.dtid(t)
            dtids.push(dtid)
            data.push({
                value: entries[i],
                dtid,
            })
        })

        return {
            dtids,
            data
        }

    }


    /**
     *
     * @param a
     */
    groupBy(a) {
        return a.reduce(
            (acc, o) => {
                if (!acc[o.typeid]) acc[o.typeid] = []
                acc[o.typeid].push(o)
                return acc;
            }, {}
        )
    }


}
