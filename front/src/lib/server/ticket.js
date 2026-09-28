import {ENV_SECRET} from "$env/static/private";
import _Identifier from "$lib/server/identifier.js";


export default {


    /**
     *
     * @param userdetail
     * @param httpHeader
     * @returns {{error}|string}
     */
    create(userdetail, httpHeader) {

        let ticket, b64, expireat, result;

        try {

            let deviceSignature = this.makeDeviceSignature(httpHeader)

            ticket = this.makeTicket(JSON.stringify(userdetail), deviceSignature);

            b64 = _Identifier.base64(ticket);

            return b64;

        } catch (err) {
            console.log(err, arguments, {
                ticket, b64, expireat, result
            })
            return {error: err}
        }
    },


    /**
     *
     * @param userdetail
     * @param httpHeader
     * @returns {{error}|string}
     */
    refresh(userdetail, httpHeader) {

        return this.create(userdetail, httpHeader);

    },


    /**
     *
     * @param cookieval
     * @param httpHeader
     * @returns {string|null}
     */
    verify(cookieval, httpHeader) {

        let ticket = _Identifier.unbase64(cookieval),
            [cookieExpireAt, cookieUserdetail, cookieVerificationHash] = ticket.split("#"),
            now = Date.now();

        if (now >= +cookieExpireAt) return null

        let currDeviceSignature = this.makeDeviceSignature(httpHeader),
            currVerificationHash = this.makeVerificationHash(cookieUserdetail, currDeviceSignature, cookieExpireAt)

        if (!Object.is(currVerificationHash, cookieVerificationHash)) return null;

        return JSON.parse(cookieUserdetail);

    },


    /**
     *
     * @param userdetail
     * @param deviceSignature
     * @returns {string|null}
     */
    makeTicket(userdetail, deviceSignature) {

        let hash, today, tomorrow, b64, expireat;

        try {

            today = new Date();
            tomorrow = new Date((today.setDate(today.getDate() + 1)));
            expireat = Date.parse(tomorrow);


            let ticketContent = this.makeTicketContent(userdetail, deviceSignature, expireat);

            // console.log('-- NEW TICKET >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ', new Date(+expireat))
            return ticketContent;


        } catch (err) {
            console.log(err, arguments, {hash, today, tomorrow, b64, expireat})
            return null;
        }
    },


    /**
     *
     * @param userdetail
     * @param deviceSignature
     * @param expireat
     * @returns {string}
     */
    makeTicketContent(userdetail, deviceSignature, expireat) {

        let verificationHash = this.makeVerificationHash(userdetail, deviceSignature, expireat);

        let contents = [expireat, userdetail, verificationHash];

        return contents.join('#');

    },


    /**
     *
     * @param userdetail
     * @param deviceSignature
     * @param expireat
     * @returns {string}
     * @private
     */
    makeVerificationHash(userdetail, deviceSignature, expireat) {

        let value = [deviceSignature, userdetail, expireat].join('');

        return _Identifier.hmac(value);

    },


    /**
     *
     * @param httpHeader
     * @returns {(string|*)[]}
     */
    makeDeviceSignature(httpHeader) {
        const userAgent = httpHeader['user-agent'] || '',
            acceptLanguage = httpHeader['accept-language'] || '';
            // platform = httpHeader['sec-ch-ua-platform'] || '';

        const signature = [
            userAgent,
            acceptLanguage,
            ENV_SECRET,
        ];

        console.log(" CURRENT SIGNATURE :: ", {signature})
        return signature;
    }


}


// const HEADERS = {
//     accept: '*/*',
//     'accept-encoding': 'gzip, deflate, br, zstd',
//     'accept-language': 'en-US,en;q=0.9,el;q=0.8,da;q=0.7,nl;q=0.6,la;q=0.5',
//     authorization: 'Bearer #TOKTOK-EN',
//     'cache-control': 'no-cache',
//     connection: 'keep-alive',
//     'content-length': '32',
//     'content-type': 'application/json; charset=UTF-8',
//     cookie: 'Phpstorm-139906de=f350deda-79d9-4b31-927f-d4fb2d871988; _ga=GA1.1.1931461076.1705998983; _ga_YPNDHPEG7N=GS1.1.1706085255.3.1.1706086364.0.0.0',
//     host: 'localhost:5000',
//     origin: 'http://localhost:5000',
//     pragma: 'no-cache',
//     referer: 'http://localhost:5000/ticket',
//     'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
//     'sec-ch-ua-mobile': '?0',
//     'sec-ch-ua-platform': '"Linux"',
//     'sec-fetch-dest': 'empty',
//     'sec-fetch-mode': 'cors',
//     'sec-fetch-site': 'same-origin',
//     'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
// }
