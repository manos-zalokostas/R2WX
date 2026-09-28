// identifier.js

import Crypto from "crypto";
import { ENV_SECRET } from "$env/static/private";
// import argon2 from 'argon2';

export default {

    /******************************* NODE JS METHODS  BELLOW */
    base64(value) {
        let buff = Buffer.from(value);
        return buff.toString('base64');
    },

    unbase64(hash) {
        let buff = Buffer.from(hash, 'base64');
        return buff.toString('ascii');
    },

    /**
     * @deprecated Use only for non-security, non-crypto purposes.
     */
    sha256(value) {
        return Crypto.createHash("sha256").update(value).digest("hex");
    },

    // --- NEW: SECURE TOKEN SIGNING ---
    /**
     * Creates a secure HMAC-SHA256 signature for data integrity.
     * @param {string} value The data to sign.
     * @returns {string} The HMAC signature as a hex string.
     */
    hmac(value) {
        return Crypto.createHmac("sha256", ENV_SECRET)
            .update(value)
            .digest("hex");
    },

    // // --- NEW: SECURE PASSWORD HASHING ---
    // /**
    //  * Hashes a password using the state-of-the-art Argon2id algorithm.
    //  * @param {string} plaintextPassword The user's password.
    //  * @returns {Promise<string>} The resulting hash string.
    //  */
    // async hashPassword(plaintextPassword) {
    //     return argon2.hash(plaintextPassword, {
    //         type: argon2.argon2id
    //     });
    // },
    //
    // /**
    //  * Verifies a plaintext password against a stored Argon2 hash.
    //  * @param {string} plaintextPassword The password from the login form.
    //  * @param {string} hash The hash stored in the database.
    //  * @returns {Promise<boolean>} True if the password is correct.
    //  */
    // async comparePassword(plaintextPassword, hash) {
    //     try {
    //         return await argon2.verify(hash, plaintextPassword);
    //     } catch (err) {
    //         console.error("Argon2 verification error:", err);
    //         return false;
    //     }
    // }
};