import {T, MIME} from "../extra.js";

export const userScheme = () => ({
    "id": {...T.NUMB, required: false},

    "first": {...T.TEXT, required: false},
    "last": {...T.TEXT, required: false},

    "email": {...T.EMAI},
    "password": {...T.PASW},

    "created": {...T.DATE, required: false},
    "updated": {...T.DATE, required: false},
});

export default userScheme;