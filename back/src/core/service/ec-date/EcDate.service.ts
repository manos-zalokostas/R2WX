import {Body, Injectable} from '@nestjs/common';


@Injectable({})
export class EcDateService {


    /**
     *
     */
    constructor() {
    }


    /**
     *
     * @param date
     * @param tz
     * @param format
     */
    toUtc(date, tz = process.env.ENV_TIMEZONE_DEF, format = 'el-GR') {

        tz = this.getTz();

        let [y, m, d, h, q] = this.getParts(date);
        console.log({strDateIso: date, y, m, d, h, q})

        let strTz = this.useFormatUtc([y, m, d, h, q], tz)

        let utc = new Date(strTz);

        return utc;
    }


    /**
     *
     * @param date
     * @param tz
     */
    toLocal(date = new Date(), tz = process.env.ENV_TIMEZONE_DEF) {

        tz = this.getTz();

        let hour = +tz.slice(0, 3),
            mins = +tz.slice(3);

        date.setHours(date.getHours() + hour)
        date.setMinutes(date.getMinutes() + mins)

        return date;
        // return this.getParts(date)
    }


    /**
     *
     * @param date
     */
    getLocalParts(date = new Date()) {
        let strLocalTimeVerbose = date.toString();

        if (!strLocalTimeVerbose.includes(this.getTz())) {
            date = this.toLocal();
            strLocalTimeVerbose = date.toString()
        }

        // strLocalTimeVerbose = "Wed Nov 01 2023 16:48:42 GMT+0200 (Eastern European Standard Time)"
        let parts = strLocalTimeVerbose.split(" ")
        // parts = ['Wed', 'Nov', '01', '2023', '16:48:42', 'GMT+0200', '(Eastern', 'European', 'Standard', 'Time)']
        let strLocalTime = parts[4];

        let [h, m, s] = strLocalTime.split(":")

        return [+h, +m, +s];
    }


    /**
     *
     * @param timeZone
     */
    getTz(timeZone = 'Europe/Athens') {

        const utcDate = new Date(Date.now());

        // Use Intl to format the date to the desired timezone
        const formatter = new Intl.DateTimeFormat('en-US', {
                timeZoneName: 'shortOffset',
                timeZone,
            }
        );

        // Retrieve the parts of the formatted date (including the offset)
        const parts = formatter.formatToParts(utcDate);

        // Extract the offset from the "timeZoneName" part
        let part = parts.find(o => o.type === 'timeZoneName');

        let tz = part.value.replace('GMT', '')
        if (tz === "") return "+0000"

        let [sign, entry] = tz.split("")

        return `${sign}0${entry}00`

    }


    getDefaultTzParts() {

        let defTz = process.env.ENV_TIMEZONE_DEF,
            defHour = defTz.slice(0, 3),
            defMin = defTz.slice(3)

        return [+defHour, +defMin]
    }


    /**
     *
     * @param date
     */
    dateid(date = new Date()) {
        let [y, m, d] = this.getParts(date);

        return +[y, m, d].join("")
    }


    /**
     *
     * @param date
     */
    getParts(date = new Date()) {
        let [y, mon, d, h, min] = date.toISOString().split(".").shift().replace("T", "-").replace(/:/g, "-").split("-");

        return [y, mon, d, h, min];
    }


    /**
     *
     * @param date
     */
    getFirstHourParts(date = new Date()) {
        let [y, mon, d, h, min] = this.getParts(date)

        return [y, mon, d, '00', '00']
    }


    /**
     *
     * @param parts
     * @param tz
     */
    useFormatUtc(parts, tz = process.env.ENV_TIMEZONE_DEF) {
        let [y, mon, d, h, min] = parts;
        return `${y}/${mon}/${d} ${h}:${min}:00 ${tz}`;
    }


    /**
     *
     * @param localDate
     */
    makeTimeIds(localDate) {

        let [strDate, strTime] = localDate.toISOString().split('.').shift().split("T"),
            [hourid, minute] = strTime.split(":"),
            dateid = strDate.replace(/-/g, "")
        let quartid = this.resolveQuart(+minute);

        return [dateid, hourid, quartid];
    }


    /**
     *
     * @param min
     */
    resolveQuart(min) {
        if (min < 15) return "00"
        if (min < 30) return "15"
        if (min < 45) return "30"
        return "45"
    }


    /**
     *
     * @param dateid
     */
    parseDateid(dateid = '20230101') {

        dateid = '' + dateid;

        let y = dateid.slice(0, 4),
            m = dateid.slice(4, 6),
            d = dateid.slice(6);

        let strdate = [y, m, d].join("-");

        return strdate;
    }


    useDefTzHour(i) {
        let [defTzHour, defTzMin] = this.getDefaultTzParts(),
            hour = i + defTzHour;

        return hour > 23 ? hour - 24 : hour;

    }


    dtid(strdate = '2024-10-08T23:00:00+00:00') {

        let [strd, strt] = strdate.split("T"),
            did = strd.replaceAll("-", ""),
            tid = strt.split(":").shift();

        return +(did.slice(2) + tid)

    }
}