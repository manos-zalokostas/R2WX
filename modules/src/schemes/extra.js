import { _T, MIME, TD } from "./base.js";

export const TX = {
    FILE_DEFAULT: {
        ...TD.FILE,
        required: false,
        accept: [
            MIME.PDF,
        ],
        value: [
            {
                path: "uploads/FILE_DEFAULT_PDF.pdf", // or "uploads/default/FILE_DEFAULT_PDF.pdf" if the folder exists
                filename: "FILE_DEFAULT_PDF.pdf",
                originalname: "FILE_DEFAULT_PDF.pdf",
                mimetype: "application/pdf",
                destination: "./uploads",
                fieldname: "file_def",
                size: 212328
            }
        ]
    }
};

export const T = { ...TX, ...TD };
export { _T, MIME };