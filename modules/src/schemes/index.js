import statCategorySchemeCore from "./stat-category/index.js";
import statOwnerSchemeCore from "./stat-owner/index.js";
import userAuthSchemeCore from "./user-auth/index.js";
import samxSchemeCore from "./samx/index.js";
import samSchemeCore from "./sam/index.js";


// EXPORT CORE SCHEMES VOCABULARY
// ==================================
export { _T } from "./base.js";



// EXPORT APP SCHEMES
// ==================================
export const samScheme = () => structuredClone(samSchemeCore());
export const samxScheme = () => structuredClone(samxSchemeCore());
export const statOwnerScheme = () => structuredClone(statOwnerSchemeCore());
export const statCategoryScheme = () => structuredClone(statCategorySchemeCore());
export const userAuthScheme = () => structuredClone(userAuthSchemeCore());


// EXPORT LITERALS
// ==================================
export {default as samLit} from "./sam/lit.js";
