import { T, MIME } from "../extra.js";

export const samScheme = () => ({
    "id": { ...T.NUMB, required: false },
    "name": T.TEXT,
    "number": { ...T.NUMB, min: 1, max: 15 },
    "float": { ...T.FLOA, min: 0, max: 1e6, value: 100 },
    "boolean": { ...T.SWIT, checked: true, required: false },
    "description": T.TEXA,
    "date": T.DATE,
    "file_def": T.FILE_DEFAULT,
    "file": { ...T.FILE, accept: [MIME.PDF], size: 3e6, required: true },
    "files": { ...T.FILE, accept: [...T.FILE.accept, MIME.PDF], multiple: true, size: 1e6 },
    "created": { ...T.DATE, required: false },
    "updated": { ...T.DATE, required: false },
});

export default samScheme;