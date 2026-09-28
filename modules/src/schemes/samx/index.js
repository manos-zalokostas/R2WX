import {T, MIME} from "../extra.js";

export const samxScheme = {
// id Int @id @default(autoincrement())
    "id": {...T.NUMB, required: false},

// title       String  @db.VarChar(160)
    "name": {...T.TEXT, maxLength: 160},

// description String? @db.Text
    "description": T.TEXA,

// status   ENUM_STATUS   @default(DRAFT)
    "status": {
        ...T.SELE,
        required: true,
        "data-options": [
            "DRAFT",
            "READY",
            "ACTIVE",
            "PAUSED",
            "CLOSED",
        ],
        value: "DRAFT",
    },

// priority ENUM_PRIORITY @default(NORMAL)
    "priority": {
        ...T.SELE,
        required: true,
        "data-options": [
            "LOW",
            "NORMAL",
            "HIGH",
            "CRITICAL",
        ],
        value: "CRITICAL",
    },

// effort   Float?
    "effort": {...T.FLOA, required: false, step: 0.1, value: 0},

// progress Int    @default(0)
    "progress": {...T.NUMB, min: 0, value: 0},

// starts_at DateTime?
    "starts_at": {...T.DATE, required: false},

// due_at    DateTime?
    "due_at": {...T.DATE, required: false},

// billable Boolean @default(false)
    "billable": {...T.SWIT, value: 'false'},

// active   Boolean @default(true)
    "active": {...T.SWIT, value: 'true'},

// category_id  Int
    "category_id": {...T.SELE, required: true},

    // owner_id Int ?
    "owner_id": {...T.SELE, required: false, value: 0},

// created DateTime @default(now())
    "created": {...T.DATE, required: false},

// updated DateTime @updatedAt
    "updated": {...T.DATE, required: false},
};

export default samxScheme;