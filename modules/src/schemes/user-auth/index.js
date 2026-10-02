import {userScheme} from "../user/index.js"

const _userScheme = userScheme();


export const userAuthScheme = () => ({

    "email": _userScheme.email,
    "pass": _userScheme.password

});

export default userAuthScheme;