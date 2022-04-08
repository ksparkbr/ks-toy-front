import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { action } from "../../../redux/redux-action";
import styles from './CovideStatus.module.css';

export default function CovidStatusToday() {

    const covidData = useSelector((s) => s.covidData);
    const selectedDate = useSelector((s) => s.covidSelectedDate);
    const [todayCovidData, setTodayCovidData] = useState([]);
    const [yesterdayCovidData, setYesterdayCovidData] = useState([]);

    const [gubunList, setGubunList] = useState([])

    const selectedGubun = useSelector((s) => s.covidSelectedGubun);

    const [displayData, setDisplayData] = useState({today : [], yesterday : []})
    
    const dispatch = useDispatch();
    
    useEffect(() => {
        if (covidData.length > 0) {
            //오늘 / 어제 날짜 구하기
            let convertStdDay = (stdDay, yesterday = false) => {
                let _stdDay = stdDay.match(/\d+/gi);
                _stdDay.pop();
                _stdDay = new Date(Date.parse(_stdDay.join("-")));
                if (yesterday) _stdDay.setDate(_stdDay.getDate() - 1);

                return new Date(Date.parse(_stdDay)).toLocaleDateString();
            }

            let today = convertStdDay(covidData[0].stdDay);
            let yesterday = convertStdDay(covidData[0].stdDay, true);

            setTodayCovidData(covidData.filter((item) => {
                return (
                    convertStdDay(item.stdDay) === today
                )
            }))

            setYesterdayCovidData(covidData.filter((item) => {
                return (
                    convertStdDay(item.stdDay) === yesterday
                )
            }))
        }
    }, [covidData])

    useEffect(() => {
        let _gubunList = todayCovidData.map((item) => item.gubun);
        setGubunList(_gubunList[0] === '합계'? _gubunList : _gubunList.reverse());

        /* console.log(todayCovidData); */
    }, [todayCovidData])

    useEffect(() => {
        if(gubunList.length > 0) 
            document.getElementById(`gubun-option-${selectedGubun.idx}`).click();
    }, [gubunList])

    useEffect(()=>{
        /* console.log(selectedGubun); */
        setDisplayData(
            {
                ...displayData,
                today : todayCovidData.filter((item)=> item.gubun === selectedGubun.item),
                yesterday : yesterdayCovidData.filter((item)=> item.gubun === selectedGubun.item),
            }
        )
    },[selectedGubun])

    return (
        <>
            <div className="text-center">
                <div className={`d-flex ${styles.gubunScroll}`}
                     style={{overflowX:"auto"}}>
                    {
                        gubunList.length > 0 && gubunList.map((item, idx) => {
                            return (
                                <React.Fragment key={`fragment-${idx}`}>
                                    <input type="radio" className="btn-check" name="options" id={`gubun-option-${idx}`}
                                        onClick={() => {
                                            dispatch(action.SET_SELECTED_GUBUN({
                                                idx: idx,
                                                item: item,
                                            }))
                                        }} />
                                    <label 
                                        className="btn btn-outline-primary" 
                                        style={{minWidth: "80px"}}
                                        htmlFor={`gubun-option-${idx}`}>{item === '합계' ? '전국' : item}</label>
                                </React.Fragment>
                            )
                        })
                    }
                </div>
                <div className="container mt-3 text-white">
                    <div className="row round">
                        <div className="col-12 bg-primary p-2"
                            style={{
                                borderBottom: "1px solid #619bfc",
                            }}>
                            <h4><b>
                            {selectedGubun.item === '합계' ? '전국' : selectedGubun.item}
                            </b></h4>
                        </div>
                    </div>
                    <div className={`row rounded bg-primary ${styles.blueGradient}`}>
                        <div className="col-4 p-3 text-center"
                            style={{
                                borderRight: "1px solid #619bfc",
                            }}>
                            <div>일일확진자</div>
                            {displayData.today.length > 0 && displayData.yesterday.length > 0 && (
                                <>
                                    <div>
                                        <span style={{fontSize : "1.5rem"}}><b>
                                        { displayData.today[0].incDec.toLocaleString("ko-KR")}명
                                        </b></span>
                                        <span>
                                            {displayData.today[0].incDec - displayData.yesterday[0].incDec <= 0 ?
                                                (
                                                    <span className="ms-2">
                                                        (
                                                        <span className="me-1 text-info" style={{fontSize:".7rem"}}>▼</span>
                                                        <span>
                                                            {(displayData.yesterday[0].incDec - displayData.today[0].incDec).toLocaleString("ko-KR")}
                                                        </span>
                                                        )
                                                    </span>
                                                ) :
                                                (
                                                    <span className="ms-2">
                                                    (
                                                        <span className="me-1 text-danger" style={{fontSize:".7rem"}}>▲</span>
                                                        <span>
                                                            {(displayData.today[0].incDec - displayData.yesterday[0].incDec).toLocaleString("ko-KR")}
                                                        </span>
                                                        )
                                                    </span>
                                                )}
                                        </span>
                                    </div>
                                    <div style={{fontSize: ".8rem", color:"#8fb9ff"}}>
                                    {selectedGubun.item !== '검역' && (
                                        <span>지역확진 {displayData.today[0].localOccCnt.toLocaleString("ko-KR")}명</span>
                                    )}
                                    <span className="ms-2">해외유입 {displayData.today[0].overFlowCnt.toLocaleString("ko-KR")}명</span>
                                    </div>
                                </>
                            )}

                        </div>
                        <div className="col-4 p-3 text-center"
                            style={{
                                borderRight: "1px solid #619bfc",
                            }}>
                            <div>누적확진자</div>
                            {displayData.today.length > 0 && (
                                <>
                                    <div>
                                        <span style={{fontSize : "1.5rem"}}><b>
                                        { displayData.today[0].defCnt.toLocaleString("ko-KR")}명
                                        </b></span>
                                        <span>
                                            <span className="ms-2">
                                                {selectedGubun.item !== '검역' && '(' + (displayData.today[0].qurRate / 100000*100).toFixed(2) + '%)'}
                                            </span>
                                        </span>
                                    </div>
                                    {selectedGubun.item !== '검역' && (
                                        <div style={{ fontSize: ".8rem", color: "#8fb9ff" }}>
                                            <span>
                                                {
                                                    selectedGubun.item === '합계' ? '전국' : selectedGubun.item
                                                }
                                            </span>
                                            <span> 인구 </span>
                                            <span>
                                                {
                                                    parseInt((displayData.today[0].defCnt) / (displayData.today[0].qurRate / 100000)).toLocaleString("ko-KR")
                                                }
                                            </span>
                                            <span>명</span>
                                        </div>
                                        )
                                    }
                                </>
                            )}

                        </div>
                        <div className="col-4 p-3 text-center"
                            style={{
                                borderRight: "1px solid #619bfc",
                            }}>
                            <div>
                                <span>
                                    사망자
                                </span>
                                <span className="ms-2" style={{ fontSize: ".8rem", color: "#8fb9ff" }}>
                                    누적(증가)
                                </span>
                            </div>
                            {displayData.today.length > 0 && (
                                <>
                                    <div>
                                        <span style={{fontSize : "1.5rem"}}><b>
                                        { displayData.today[0].deathCnt.toLocaleString("ko-KR")}명
                                        </b></span>
                                        <span>
                                            <span className="ms-2">
                                                {selectedGubun.item !== '검역' && '(+' + (displayData.today[0].deathCnt - displayData.yesterday[0].deathCnt).toLocaleString("ko-KR") + ')'}
                                            </span>
                                        </span>
                                    </div>
                                    
                                        <div style={{ fontSize: ".8rem", color: "#8fb9ff" }}>
                                            <span>사망률</span>
                                            <span> {(displayData.today[0].deathCnt / displayData.today[0].defCnt * 100).toFixed(2)}%</span>
                                        </div>
                                </>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}