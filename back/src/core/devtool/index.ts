import * as util from "node:util";

export const ___serverLog = (x) => console.log(
    " _____________ SERVER - DEEP - LOG :: ________________________________________________ ",
    util.inspect(x, null, Infinity)
)
