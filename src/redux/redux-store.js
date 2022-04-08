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
    covidData: [],
    covidSelectedDate : {
        year: new Date().getFullYear().toString(),
        month: (new Date().getMonth() + 1).toString(),
        day : new Date().getDate().toString()
    },
    covidSelectedGubun : {
        idx: 0,
        item: '합계',
    },
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
        case type.SET_COVID_DATA:
            return {
                ...state,
                covidData : action.data
            }
        case type.SET_COVID_SELECTED_DATE:
            return {
                ...state,
                covidSelectedDate : action.data
            }
        case type.SET_SELECTED_GUBUN:
            return {
                ...state,
                covidSelectedGubun : action.data
            }
        default:
            return state;
    }
}

export const reduxStore = createStore(reducer);