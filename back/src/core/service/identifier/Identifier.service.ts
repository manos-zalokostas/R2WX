import {Injectable} from "@nestjs/common";
import * as argon2 from 'argon2';
import Crypto from "crypto";


@Injectable()
export class IdentifierService {


    base64(value) {
        let buff = Buffer.from(value);
        return buff.toString('base64');
    }

    unbase64(hash) {
        let buff = Buffer.from(hash, 'base64');
        return buff.toString('ascii');
    }

    sha256(value) {
        return Crypto.createHash("sha256").update(value).digest("hex");
    }

    hmac(value) {
        return Crypto.createHmac("sha256", process.env.ENV_SECRET)
            .update(value)
            .digest("hex");
    }

    async argon2Hash(plaintextPassword) {
        return argon2.hash(plaintextPassword, {
            type: argon2.argon2id
        });
    }

    async argon2HashCompare(plaintextPassword, hash) {
        try {
            await argon2.verify(hash, plaintextPassword);
            return true;
        } catch (err) {
            console.error("Argon2 verification error:", err);
            return false;
        }
    }
};