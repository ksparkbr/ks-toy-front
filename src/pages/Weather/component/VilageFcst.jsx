import axios from 'axios';
import * as echarts from 'echarts'
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Spinner from '../../../component/Spinner';
import { getDateFormatDisplay } from '../../../util/util';
import styles from '../Weather.module.css';

export default function VilageFcst({ data }) {
    const [stateData, setStateData] = useState({});
    const [selectDate, setSelectDate] = useState('');
    const [displayData, setDisplayData] = useState({});
    const [selectMode, setSelectMode] = useState('TMP');

    const [load, setLoad] = useState(false);

    const getWeather = (nx, ny) => {
        setLoad(false);
        axios.get(process.env.REACT_APP_BACKEND + '/getVilageFcst', {
            params: {
                x: nx,
                y: ny,
            }
        }).then((response) => {
            let _ret = {};
            let data = response.data;
            console.log(stateData);
            data.length > 0 && data.map((item, idx) => {
                _ret[item.fcstDate] = { ..._ret[item.fcstDate] }
                _ret[item.fcstDate][item.fcstTime] = { ..._ret[item.fcstDate][item.fcstTime] }
                _ret[item.fcstDate][item.fcstTime][item.category] = item.fcstValue;
                _ret[item.fcstDate][item.fcstTime].baseDate = item.baseDate;
                _ret[item.fcstDate][item.fcstTime].baseTime = item.baseTime;
            })

            setStateData(_ret);
            setLoad(true);
            //console.log(_ret[_key[0]]);
        })
    }

    useEffect(()=>{
        if(load){
            try{
                document.getElementById(`option1`).click();
                document.getElementById(`div-btn-0`).click();
            }catch(e){}
        }
    }, [load])

    const locationInfo = useSelector((s) => s.locationInfo);

    useEffect(() => {
        setLoad(false);
        if (locationInfo != null) {
            if (locationInfo.x != null && locationInfo.y != null) {
                getWeather(locationInfo.x, locationInfo.y);
            }
        }
    }, [locationInfo])

    useEffect(() => {
        if (load) {
            let myChart;
            try{echarts.dispose(document.getElementById('vilage_fcst_chart-area'))}catch(e){}
            if (stateData[selectDate] !== undefined) {
                let _data = stateData[selectDate];
                let _keys = Object.keys(_data);
                _keys.sort((a, b) => {
                    if (a > b) return 1;
                    if (a < b) return -1;
                })
                let TMP = [];     // 온도 배열
                let REH = [];     // 습도 배열
                let POP = [];     // 강수 확률
                let PCP = [];
                let CATEGORY = [];  // X축 배열
                _keys.forEach((item) => {
                    TMP.push(_data[item].TMP);
                    REH.push(_data[item].REH);
                    POP.push(_data[item].POP);
                    PCP.push(_data[item].PCP);
                    CATEGORY.push(item.substring(0, 2) + "시")
                })

                let chartDom = document.getElementById('vilage_fcst_chart-area');
                myChart = echarts.init(chartDom);
                let option = {
                    xAxis: {
                        type: 'category',
                        data: CATEGORY
                    },
                    yAxis: {
                        type: 'value'
                    },
                    grid: {
                        left: 20,
                        right: 0,
                        top: 20,
                        bottom: 20,
                        width: 'auto',
                        height: 'auto',
                    },
                };

                switch (selectMode) {
                    case 'TMP':
                        option.series = [];
                        option = {
                            ...option,
                            series: [
                                {
                                    label: {
                                        show: true,
                                        formatter: '{c}℃'
                                    },
                                    data: TMP,
                                    type: 'line',
                                    smooth: true
                                },
                            ]
                        }
                        break;
                    case 'REH':
                        option.series = [];
                        option = {
                            ...option,
                            series: [
                                {
                                    label: {
                                        show: true,
                                        formatter: '{c}%'
                                    },
                                    data: REH,
                                    type: 'line',
                                    smooth: true
                                },
                            ]
                        }
                        break;
                    case 'POP':
                        option.series = [];
                        option = {
                            ...option,
                            series: [
                                {
                                    label: {
                                        show: true,
                                        formatter: '{c}mm'
                                    },
                                    data: PCP,
                                    type: 'line',
                                    stacked: 'total',
                                    smooth: true
                                },
                                {
                                    label: {
                                        show: true,
                                        formatter: '{c}%'
                                    },
                                    data: POP,
                                    type: 'line',
                                    stacked: 'total',
                                    smooth: true
                                },
                            ]
                        }
                        break;

                }

                option && myChart.setOption(option);
                window.onresize = () => {
                    myChart.resize();
                }
                setLoad(true);
            }
        }
    }, [selectDate, selectMode, load]);
    return (
        <>

            <div className="card" style={{ marginTop: "1rem" }}>
                <div className="card-header text-center bg-primary text-white">
                    <div className="btn-group ms-3">
                        <input type="radio" className="btn-check" name="options" id="option1"
                            onClick={() => {
                                setSelectMode('TMP');
                            }} />
                        <label className="btn btn-primary" htmlFor="option1">기온</label>

                        <input type="radio" className="btn-check" name="options" id="option2"
                            onClick={() => {
                                setSelectMode('REH');
                            }} />
                        <label className="btn btn-primary" htmlFor="option2">습도</label>

                        <input type="radio" className="btn-check" name="options" id="option3"
                            onClick={() => {
                                setSelectMode('POP');
                            }} />
                        <label className="btn btn-primary" htmlFor="option3">강수확률/강수량</label>
                    </div>
                </div>
                <div className="card-body text-center">
                    {!load ? (<Spinner />) : (<>
                        <div key="valiage_fcst_div1" className="d-flex flex-wrap justify-content-center">
                            {stateData && Object.keys(stateData).length > 0 && Object.keys(stateData).map((item, idx) => {
                                return (<React.Fragment key={"React-Fragment-" + idx}>
                                    <input type="radio" id={`div-btn-${idx}`} name="option-dates"
                                        key={`radio-btn-${idx}`} className={`btn-check`} data-mdb-ripple-color="info"
                                        onClick={() => {
                                            setSelectDate(item);
                                        }} />
                                    <label key={`label-btn-${idx}`} className="btn btn-primary ms-1 me-1" htmlFor={`div-btn-${idx}`}>{getDateFormatDisplay(item)}</label>
                                </React.Fragment>
                                )
                            })}
                        </div>
                        <div key="valiage_fcst_div2" 
                             id="vilage_fcst_chart-area" style={{ width: "100%", height: "300px" }} />
                    </>)}
                </div>

            </div >
        </>
    );
}