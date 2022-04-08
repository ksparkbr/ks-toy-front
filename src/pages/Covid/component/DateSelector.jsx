import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { action } from "../../../redux/redux-action";

export default function DateSelector() {

    const [today, setToday] = useState(new Date().toLocaleDateString());
    const [yearList, setYearList] = useState([]);
    const [monthList, setMonthList] = useState([]);
    const [dayList, setDayList] = useState([]);
    const [firstRender, setFirstRender] = useState(false);
    const [lastSearchDate, setLastSearchDate] = useState({year: '', month: '', day:''});

    const selectedDate = useSelector((s)=>s.covidSelectedDate);
    const dispatch = useDispatch();

    useEffect(()=>{
        let _yearList = [];
        for(let i=2020; i<=new Date().getFullYear(); i++){
            _yearList.push(i);
        }
        setYearList(_yearList.reverse())
        dispatch(action.SET_COVID_SELECTED_DATE({
            year: new Date().getFullYear().toString(),
            month: (new Date().getMonth() + 1).toString(),
            day : new Date().getDate().toString()
        }))
    },[])
    
    useEffect(()=>{
        try {
            /* console.log(selectedDate); */
            let date_year = document.getElementById("date-year");
            let date_month = document.getElementById("date-month");
            let date_day = document.getElementById("date-day");

            date_year.value = selectedDate.year;
            date_month.value = selectedDate.month;
            date_day.value = selectedDate.day;

            // useEffect가 동시에 중복 호출됨을 방지하는 로직 (찾았던 적이 있었던 날짜는 두번 호출하지 않음)
            let _lastSearchDate = `${lastSearchDate.year}${lastSearchDate.month}${lastSearchDate.day}`
            let _selectedDate = `${selectedDate.year}${selectedDate.month}${selectedDate.day}`

            if(_lastSearchDate != _selectedDate){
                setLastSearchDate(selectedDate);
                axios.get(process.env.REACT_APP_BACKEND + "/getCovid",
                    {
                        params: {
                            searchDate: `${selectedDate.year}-${selectedDate.month}-${selectedDate.day}`
                        }
                    }).then((res) => {
                        dispatch(action.SET_COVID_DATA(res.data));  // 리덕스에 검색결과 저장
                });
            }
        } catch (e) { }

    },[selectedDate])

    useEffect(()=>{
        let _monthList = [];
        for(let i=1; i<=12;i++){
            if(selectedDate.year === new Date().getFullYear().toString()){
                if(i > new Date().getMonth() + 1) break;
            }
            _monthList.push(i);
        }
        setMonthList(_monthList);
        if(firstRender){
            dispatch(action.SET_COVID_SELECTED_DATE({
                ...selectedDate,
                month: '1',
                day : '1',
            }))
        }
        setFirstRender(true);
    },[selectedDate.year])

    useEffect(()=>{
        let _dayList = [];
        let maxDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let _maxDay = maxDays[selectedDate.month];

        if(parseInt(selectedDate.year) % 4 === 0 && selectedDate.month === '2') _maxDay = 29;
        if(parseInt(selectedDate.year) == new Date().getFullYear() && parseInt(selectedDate.month) === new Date().getMonth() + 1){
            _maxDay = new Date().getDate();
        }

        if(selectedDate.year === '2020' && selectedDate.month === '1'){
            for(let i=21;i<=_maxDay;i++){
                _dayList.push(i);
            }
        }
        else{
            for(let i=1;i<=_maxDay;i++){
                _dayList.push(i);
            }
        }

        if(selectedDate.day > new Date().getDate()){
            dispatch(action.SET_COVID_SELECTED_DATE({
                ...selectedDate,
                day: new Date().getDate().toString()
            }))
        }
        setDayList(_dayList);
    },[selectedDate.month])

    return (
        <>
            <div className="input-group text-white justify-content-center">
                <span className="input-group-text text-white">날짜</span>
                <select id="date-year" onChange={(e)=>{
                    dispatch(action.SET_COVID_SELECTED_DATE({
                        ...selectedDate,
                        year: e.target.value,
                    }))
                }}>
                    {
                        yearList.length > 0 && yearList.map((item, idx) => {
                            return (
                                <option 
                                    key={`year-option-idx-${idx}`}
                                    value={item}
                                >
                                    {item}년
                                </option>
                            )
                        })
                    }
                </select>
                <select  id="date-month" onChange={(e)=>{
                    dispatch(action.SET_COVID_SELECTED_DATE({
                        ...selectedDate,
                        month: e.target.value,
                    }))
                }}>
                    {
                        monthList.length > 0 && monthList.map((item, idx) => {
                            return (
                                <option 
                                    key={`month-option-idx-${idx}`}
                                    value={item}
                                >
                                    {item}월
                                </option>
                            )
                        })
                    }
                </select>
                <select id="date-day"  onChange={(e)=>{
                   dispatch(action.SET_COVID_SELECTED_DATE({
                    ...selectedDate,
                    day: e.target.value,
                }))
                }}>
                    {
                        dayList.length > 0 && dayList.map((item, idx) => {
                            return (
                                <option 
                                    key={`month-option-idx-${idx}`}
                                    value={item}
                                >
                                    {item}일
                                </option>
                            )
                        })
                    }
                </select>
            </div>
        </>
    );
}