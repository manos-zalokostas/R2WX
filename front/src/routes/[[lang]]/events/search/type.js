import {INPUT as _} from "$type";

export default {
    name: {
        type: _.TEXT,
        required: true,
    },
    type: {
        type: _.SELECT,
        ['data-values']: [1,2],
        required: false,
    },
    topology: {
        type: _.SELECT,
        ['data-values']: [1,2],
        required: false,
    },
    intensity: {
        type: _.SELECT,
        ['data-values']: [1,2],
        required: false,
    },
    occur_time: {
        type: _.SELECT,
        ['data-values']: [1,2],
        required: false,
    },
    date_start: {
        type: _.SELECT,
        ['data-values']: [1,2],
        required: false,
    },
    date_end: {
        type: _.SELECT,
        ['data-values']: [1,2],
        required: false,
    },
    detail: {
        type: _.TEXTAREA,
        required: true,
    },
}