export const toQueryString = (obj) => {
    let _k = Object.keys(obj);
    let _ret = [];
    _k.forEach((item) => {
        _ret.push(`${item}=${obj[item]}`)
    })
    return "?" + _ret.join("&")
}

export function windDegree(_deg) {
    let deg = parseInt(_deg);
    let ret = {};
    if (deg >= 0 && deg < 23) ret = { eng: "N", kor: "북" };
    if (deg >= 23 && deg < 68) ret = { eng: "NE", kor: "북동" };
    if (deg >= 68 && deg < 113) ret = { eng: "E", kor: "동" };
    if (deg >= 113 && deg < 158) ret = { eng: "SE", kor: "남동" };
    if (deg >= 158 && deg < 203) ret = { eng: "S", kor: "남" };
    if (deg >= 203 && deg < 248) ret = { eng: "SW", kor: "남서" };
    if (deg >= 248 && deg < 293) ret = { eng: "W", kor: "서" };
    if (deg >= 293 && deg < 338) ret = { eng: "NW", kor: "북서" };
    if (deg >= 338 && deg <= 360) ret = { eng: "N", kor: "북" };
    return ret;
}

export function getDateFormatDisplay(_date){
    let _year = _date.substring(0,4);
    let _month = _date.substring(4,6);
    let _day = _date.substring(6,8);
    var date = new Date(Date.parse(`${_year}.${_month}.${_day}`));
    let _dow = ['일','월','화','수','목','금','토'][date.getDay()];
    
    return `${_month}.${_day}(${_dow})`;
}