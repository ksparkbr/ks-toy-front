import { useEffect, useState } from 'react';
import styles from './CovideStatus.module.css'
import * as echarts from 'echarts';
import { useSelector } from 'react-redux';
import { reduxStore } from '../../../redux/redux-store';

export default function CovidStatusChart() {
    const covidData = useSelector((s) => s.covidData);
    const selectedDate = useSelector((s) => s.covidSelectedDate);
    const selectedGubun = useSelector((s) => s.covidSelectedGubun);
    const [scopeMode, setScopeMode] = useState('');  // inc : 일일, def : 누적
    const [periodMode, setPeriodMode] = useState(0);  // 기간만큼 설정 (2일 부터 60일까지)

    useEffect(() => {
        document.getElementById("scope-option-1").click();
        document.getElementById("period-option-1").click();
    }, [])

    useEffect(() => {
        let convertStdDay = (stdDay, period=2) => {
            let _stdDay = stdDay.match(/\d+/gi);
            _stdDay.pop();
            _stdDay = new Date(Date.parse(_stdDay.join("-")));

            let _year = _stdDay.getFullYear().toString();
            let _month = (_stdDay.getMonth() + 1) < 10 ? "0" + (_stdDay.getMonth() + 1) : (_stdDay.getMonth() + 1).toString();
            let _day = _stdDay.getDate() < 10 ? "0" + (_stdDay.getDate()) : _stdDay.getDate().toString();

            let _ret = {
                to : `${_year}${_month}${_day}`,
            }

            _stdDay.setDate(_stdDay.getDate() - period);
            _year = _stdDay.getFullYear().toString();
            _month = (_stdDay.getMonth() + 1) < 10 ? "0" + (_stdDay.getMonth() + 1) : (_stdDay.getMonth() + 1).toString();
            _day = _stdDay.getDate() < 10 ? "0" + (_stdDay.getDate()) : _stdDay.getDate().toString();

            _ret = {
                ..._ret,
                from : `${_year}${_month}${_day}`,
            }
            return _ret;
        }

        let _period = convertStdDay(`${selectedDate.year}년 ${selectedDate.month}월 ${selectedDate.day}일 00시`, periodMode);
        let _filteredGubun = covidData.filter((item)=>{
            return item.gubun === selectedGubun.item;
        })

        let _filteredPeriod = _filteredGubun.filter((item)=>{
            
            let _ret = convertStdDay(item.stdDay).to >= _period.from && convertStdDay(item.stdDay).to <= _period.to
            return (
                _ret
            )
        })

        console.log(_filteredPeriod);

        let chartCategories = _filteredPeriod.map((item)=>item.stdDay.match(/\d+월 \d+일/)[0].split(/월 /).join('/').replace("일",'')).reverse();
        console.log(chartCategories);
        let chartData = [];

        switch(scopeMode){
            case 'inc':
                chartData = _filteredPeriod.map((item)=>item.incDec).reverse();
                break;
            case 'def':
                chartData = _filteredPeriod.map((item)=>item.defCnt).reverse();
                break;
            default:
                break;
        }

        console.log(chartData);






        let myChart;
        try { echarts.dispose(document.getElementById('covid_chart-area')) } catch (e) { }
        let chartDom = document.getElementById('covid_chart-area');
        myChart = echarts.init(chartDom);
        let option = {
            tooltip: {},
            xAxis: {
                type: 'category',
                data: chartCategories
            },
            yAxis: {
                type: 'value'
            },
            
            grid: {
                left: 70,
                right: 0,
                top: 20,
                bottom: 20,
                width: 'auto',
                height: 'auto',
            },
            series: [
                {
                    data: chartData,
                    itemStyle : {
                        color: '#ff5c00',
                        borderRadius: 10,
                    },
                    type: 'bar',
                    smooth: true,
                    barMaxWidth: 10,
                },
            ]
        };

        option && myChart.setOption(option);
        window.onresize = () => {
            myChart.resize();
        }


    }, [scopeMode, periodMode, selectedGubun])
    return (
        <>
            <div className="d-flex justify-content-between mt-3">
                <div className="d-flex">
                    <input type="radio" className="btn-check" name="scope-options" id={`scope-option-1`}
                        onClick={() => {
                            setScopeMode('inc')
                        }} />
                    <label
                        className="btn btn-outline-primary"
                        style={{ minWidth: "80px" }}
                        htmlFor={`scope-option-1`}>일일</label>

                    <input type="radio" className="btn-check" name="scope-options" id={`scope-option-2`}
                        onClick={() => {
                            setScopeMode('def')
                        }} />
                    <label
                        className="btn btn-outline-primary"
                        style={{ minWidth: "80px" }}
                        htmlFor={`scope-option-2`}>누적</label>
                </div>

                <div className="d-flex form-check">
                    <div className="ms-5">
                        <input type="radio" className="form-check-input" id="period-option-1" name="period-option"
                            onClick={() => {
                                setPeriodMode(7)
                            }} />
                        <label htmlFor="period-option-1" className="form-check-label">7일</label>
                    </div>
                    <div className="ms-5">
                        <input type="radio" className="form-check-input" id="period-option-2" name="period-option"
                            onClick={() => {
                                setPeriodMode(30)
                            }} />
                        <label htmlFor="period-option-2" className="form-check-label">30일</label>
                    </div>
                    <div className="ms-5">
                        <input type="radio" className="form-check-input" id="period-option-3" name="period-option"
                            onClick={() => {
                                setPeriodMode(60)
                            }} />
                        <label htmlFor="period-option-3" className="form-check-label">60일</label>
                    </div>
                </div>
            </div>
            <div id="covid_chart-area" style={{ width: "100%", height: "300px" }} />
        </>
    );
}