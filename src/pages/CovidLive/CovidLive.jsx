import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "../../component/Spinner";
import styles from "./CovidLive.module.css";

export default function CovidLive() {

    const [originMsgList, setOriginMsgList] = useState([]);
    const [msgList, setMsgList] = useState([]);
    const [filteredMsgList, setfilteredMsgList] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [total, setTotal] = useState(0);

    const getMessages = (today) => {
        let year = today.getFullYear();
        let month = (today.getMonth() + 1) < 10 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1);
        let day = (today.getDate()) < 10 ? "0" + (today.getDate()) : (today.getDate());

        axios({
            method: "GET",
            url: process.env.REACT_APP_BACKEND + "/getCovidLive",
            params: {
                searchDate: `${year}-${month}-${day}`
            }
        }).then((res) => {
            setOriginMsgList(res.data)
            if (res.data.length === 0) {
                let yesterday = today;
                yesterday.setDate(today.getDate() - 1);
                getMessages(yesterday);
            }
        });
    }

    useEffect(() => {
        getMessages(new Date());
    }, [])

    useEffect(() => {
        let _msgList = originMsgList.filter((item, idx) => {
            return (item.MSG_CN.match(/((-)?\d{1,3}(,\d{3})*(\.\d+)?)명/) !== null);
        })
        setMsgList(_msgList)

        let _covidList = [];
        _msgList.map((item, idx) => {
            _covidList.push(parseInt(item.MSG_CN.match(/((-)?\d{1,3}(,\d{3})*(\.\d+)?)명/)[0].replace(/,|명/gi, '')))
        })

        let _total = 0;
        _covidList.forEach((item) => {
            _total += item;
        })
        setTotal(_total);
        setfilteredMsgList(_msgList);
    }, [originMsgList]);

    useEffect(() => {
        if(searchKeyword === ''){
            setfilteredMsgList(msgList);
        }
        else{
            //RCV_AREA_NM
            setfilteredMsgList(
                msgList.filter((item)=>{
                    return ( item.RCV_AREA_NM.search(searchKeyword) >= 0 
                    || item.MSG_CN.search(searchKeyword) >= 0)
                })

            )
        }
    }, [searchKeyword])
    return (
        <>
            <div className="container">
                <div className="card">
                    <div className="card-header bg-primary text-white text-center"
                        style={{
                            position: "sticky",
                            top: "0px",
                            zIndex: "99"
                        }}>
                        <h5>
                            <b>코로나 실시간 확진 현황</b>
                        </h5>
                        {msgList.length == 0 ? (<Spinner />) : (
                            <>
                                <span>{msgList.length > 0 && msgList[0].CREAT_DT} 기준</span>
                                <span> : {total.toLocaleString("ko-KR")}명</span>
                            </>
                        )}
                    </div>
                    <div className="card-body text-center">
                        <div className="input-group"
                            style={{
                                position: "sticky",
                                top: "85px"
                            }}>
                            <span className="input-group-text">
                                검색
                            </span>
                            <input type="text" className="form-control" onChange={(e)=>{setSearchKeyword(e.target.value)}}/>
                        </div>
                        {msgList.length == 0 ? (<Spinner />) : (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>시간</th>
                                        <th>지역</th>
                                        <th>확진자</th>
                                        <th>내용</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        filteredMsgList.length > 0 && filteredMsgList.map((item, idx) => {
                                            return (
                                                <tr key={`msg-list-key-${idx}`}>
                                                    <td>{item.CREAT_DT}</td>
                                                    <td>{item.RCV_AREA_NM}</td>
                                                    <td>{item.MSG_CN.match(/((-)?\d{1,3}(,\d{3})*(\.\d+)?)명/)[0]}</td>
                                                    <td className={styles.msgContent}>{item.MSG_CN}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        )
                        }
                    </div>

                </div>
            </div>
        </>
    );
}