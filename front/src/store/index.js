import {derived, readable, writable} from "svelte/store";
import {page} from "$app/stores";
import {FORM} from "$var";
import {LIT} from "$lit";


export const ui = writable({

    modalStatus: false,
    tableFilters: [],
    isLoading: null,
    modalEntry: "",
    multiSel: null,

    activeFilter: '',
    activeFilterPath: '',
    activeFilterName: '',
    activeSearch: '',

    entity: 1,

    searchToolDialogOpen: false,

    alertBox: {
        status: '',
        links: [],
    },
    confirmBox: 0,
})


/*

 */
export const form = writable({
    uri: null,
    isEdited: false,
    isEditable: false,
    isCancelable: false,
    mode: FORM.READ,
    action: null
})


/*

 */
export const active = derived(page, ($page) => {

    const _updateFormLits = (form) => {
        if (!form) return form;
        let map = Object.entries(form).map(
            ([key, entry]) => {
                entry.title = LIT[entry.title] || entry.title
                return [key, entry];
            }
        )
        return Object.fromEntries(map);
    }

    const _isFormFilled = (val) => Array.isArray(val) ? val[0] : val;


    const submitFormAsState = $page.data.submitFormAsState,
        isFormFilled = _isFormFilled($page.data.form?.id?.value),
        form = _updateFormLits($page.data.form),
        unit = $page.data.activeUnit,
        entity = $page.data.entity,
        meta = $page.data.meta || {},
        org = $page.data.orgCurr,
        isFormEdited = false,
        uri = $page.data.uri;

    // console.log("FORM ===========", {PAGE_DATA_FORM: $page.data.form})
    return {
        submitFormAsState,
        isFormFilled,
        isFormEdited,
        entity,
        meta,
        form,
        unit,
        org,
        uri,
    }

})


/*

 */
export const valid = writable({
    action: {},
    state: {},
})


/**
 *
 * @type {Writable<{}>}
 */
export const action = writable({})


/**
 *
 * @type {Writable<{status: null}>}
 */
export const request = writable({
    status: null
})


/*

 */
export const unitStatus = writable({
    warns: {
        errors: [],
        services: [],
        installs: [],
        freons: [],
    },
    visible: []
})


