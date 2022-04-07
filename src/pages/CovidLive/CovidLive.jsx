import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./CovidLive.module.css";

export default function CovidLive() {

    const [originMsgList, setOriginMsgList] = useState([]);
    const [msgList, setMsgList] = useState([]);
    const [total, setTotal] = useState(0);

    const getMessages = (yesterday = false)=>{
        let today = new Date();
        if(yesterday){
            today.setDate(today.getDate()-1);
        }
        let year = today.getFullYear();
        let month = (today.getMonth()+1) < 10 ? "0" + (today.getMonth()+1) : (today.getMonth()+1);
        let day = (today.getDate()) < 10 ? "0" + (today.getDate()) : (today.getDate());

        axios({
            method : "GET",
            url : process.env.REACT_APP_BACKEND + "/getCovidLive",
            params : {
                searchDate : `${year}-${month}-${day}`
            }
        }).then((res) => {
            setOriginMsgList(res.data)
        });
    }
    
    useEffect(() => {
        getMessages();
    }, [])

    useEffect(()=>{
        let _msgList = originMsgList.filter((item, idx)=>{
            return ( item.MSG_CN.match(/((-)?\d{1,3}(,\d{3})*(\.\d+)?)명/) !== null);
        })
        setMsgList(_msgList)

        let _covidList = [];
        _msgList.map((item,idx)=>{
            _covidList.push(parseInt(item.MSG_CN.match(/((-)?\d{1,3}(,\d{3})*(\.\d+)?)명/)[0].replace(/,|명/gi, '')))
        })

        let _total = 0;
        _covidList.forEach((item)=>{
            _total += item;
        })
        setTotal(_total);
        
    },[originMsgList]);

    useEffect(()=>{
        if(total == 0) getMessages(true);
    }, [total])
    return (
        <>
            <div className="container">
                <div className="card">
                    <div className="card-header bg-primary text-white text-center">
                        <h5>
                            <b>코로나 실시간 확진 현황</b>
                        </h5>
                        <span>{msgList.length > 0 && msgList[0].CREAT_DT} 기준</span>
                        <span> : {total.toLocaleString("ko-KR")}명</span>
                    </div>
                    <div className="card-body">
                        <table class="table">
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
                                    msgList.length > 0 && msgList.map((item,idx)=>{
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
                    </div>

                </div>
            </div>
        </>
    );
}