import { createStore } from "redux";
import * as type from "./redux-action-type";

const initState = {
    locationInfo : {
        x: null,
        y: null,
        level1: null,
        level2: null,
        level3: null,
    },
    sideBarState : 1,
}

const reducer = (state = initState, action)=>{
    switch (action.type) {
        case type.SET_LOC_INFO:
            return {
                ...state,
                locationInfo: action.data,
            }
        case type.SET_LOC_NULL:
            return {
                ...state,
                locationInfo : initState.locationInfo,
            }
        case type.TOGGLE_SIDEBAR:
            return {
                ...state,
                sideBarState: (state.sideBarState + 1) % 2
            }
        default:
            return state;
    }
}

export const reduxStore = createStore(reducer);