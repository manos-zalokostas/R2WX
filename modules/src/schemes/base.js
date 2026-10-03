export const _T = Object.freeze({
    TEXT: "text",
    NUMB: "number",
    FLOA: "number",
    TEXA: "textarea",
    SWIT: "switch",
    SWIG: "switch-group",
    CHEB: "checkbox",
    SELE: "select",
    SELM: "select-multi",
    RADI: "radio",
    PASW: 'password',
    EMAI: 'email',
    DATE: 'date',
    FILE: 'file'
})

export const MIME = Object.freeze({
    JPG: '.jpg',
    PNG: '.png',
    XML: ".xml",
    XLS: ".xls",
    XLSX: ".xlsx",
    PDF: ".pdf",
    MAT: '.mat',
    M: '.m',
});

export const TD = {
    TEXT: {
        type: _T.TEXT,
        required: true,
        minLength: 3,
        maxLength: 150,
        placeholder: "text: i.e. a name"
    },

    NUMB: {
        type: _T.NUMB,
        required: true,
        min: 1,
        max: 1000,
        step: 1,
        placeholder: "number: i.e. 5"
    },

    FLOA: {
        type: _T.FLOA,
        required: true,
        min: 0.0,
        max: 1000.0,
        step: 0.01,
        placeholder: "float: i.e. 5.05"
    },

    TEXA: {
        type: _T.TEXA,
        required: false,
        minLength: 3,
        maxLength: 300,
        placeholder: "text: i.e.. some lengthy text"
    },

    SWIT: {
        type: _T.SWIT,
        required: false,
        checked: false, /* value: '1' ? */
        "data-options": [
            'false',
            'true',
        ]
    },
    // Does switch need a default 'value' attribute?
    SWIG: {
        type: _T.SWIG,
        required: false,
        "data-options": [
            1,
            2,
            3,
            4,
            5
        ],
    },
    CHEB: {
        type: _T.CHEB,
        required: false,
        checked: false /* value: 'someValue'? */
    },
    // Does checkbox need a default 'value'?
    SELE: {
        type: _T.SELE,
        required: false,
        "data-options": [1,
            2,
            3,
            4,
            5],
    },
    SELM: {
        type: _T.SELM,
        multiple: true,
        required: false,
        "data-options": [1,
            2,
            3,
            4,
            5],
    },
    RADI: {
        type: _T.RADI,
        required: false,
        "data-options": [1,
            2,
            3,
            4,
            5],
    },
    DATE: {
        type: _T.DATE,
        required: true,
        placeholder: "Select a date"
    },
    //  -- MORE ACCEPT FORMATS::
    //  .x.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document
    FILE: {
        type: _T.FILE,
        required: true,
        placeholder: "Select a file",
        accept: [
            MIME.XLS,
            MIME.XLSX,
            MIME.JPG,
        ],
        size: 6e5,
    },
    PASW: {
        type: _T.PASW,
        required: true,
        placeholder: "Enter password",
        minLength: 8,
        pattern: ".+",
        // pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$",
        title: "Must be at least 8 characters and contain a lowercase letter, an uppercase letter, a number, and a special character.",
    },
    EMAI: {
        type: _T.EMAI,
        required: true,
        placeholder: "Enter email",
        maxLength: 191,
        minLength: 8,
        pattern: "^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$",
        title: "Please enter a valid email address (e.g., name@example.com).",
    },
};

