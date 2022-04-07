import * as type from './redux-action-type'

export const action = {
    SET_LOC_INFO: (data) => {
        return {
            type: type.SET_LOC_INFO,
            data: data,
        }
    },
    SET_LOC_NULL: () => {
        return {
            type: type.SET_LOC_NULL
        }
    },
    TOGGLE_SIDEBAR: () => {
        return {
            type: type.TOGGLE_SIDEBAR
        }
    }
}