import { locateDB } from "./locate-db"

export const searchLocate = {
    level1: () => {
        return [...new Set(locateDB.map((item) => item.level1))]
    },
    level2: (lvl1) => {
        return [...new Set(
            locateDB.filter((item) => item.level1 === lvl1 && item.level2 !== '')
                .map((item) => item.level2)
        )];
    },
    level3: (lvl1, lvl2) => {
        return [...new Set(
            locateDB.filter((item) => item.level1 === lvl1)
                .filter((item) => item.level2 === lvl2 && item.level3 !== '')
                .map((item) => item.level3)
        )];
    },
    search : (lvl1,lvl2,lvl3)=>{
        let ret = locateDB.filter((item)=>{
            return item.level1 === lvl1 && item.level2 === lvl2 && item.level3 === lvl3;
        })
        let _ret = ret.length > 0 ? ret[0] : null
        return _ret;
    }
}