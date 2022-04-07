import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Spinner from "../../../component/Spinner";
import * as util from "../../../util/util";

export default function FcstSrt() {

    const [stateData, setStateData] = useState({});

    const getWeather = (nx, ny) => {
        axios.get(process.env.REACT_APP_BACKEND + '/getUltraSrtFcst', {
            params: {
                x: nx,
                y: ny,
            }
        }).then((response) => {
            let _ret = {};
            let data = response.data;
            data.length > 0 && data.map((item, idx) => {
                _ret[item.fcstTime] = { ..._ret[item.fcstTime] }
                _ret[item.fcstTime][item.category] = item.fcstValue;
                _ret[item.fcstTime].baseDate = item.baseDate;
                _ret[item.fcstTime].baseTime = item.baseTime;
            })
            let _key = Object.keys(_ret);
            //console.log(_key);
            if (_key.length > 0)
                setStateData(_ret[_key[0]]);
        })
    }

    const locationInfo = useSelector((s) => s.locationInfo);

    useEffect(() => {
        if (locationInfo != null) {
            if (locationInfo.x != null && locationInfo.y != null) {
                getWeather(locationInfo.x, locationInfo.y);
            }
        }
    }, [locationInfo])

    const icon = () => {
        if (stateData.LGT !== '0') { // 낙뢰가 있는 경우 낙뢰로 표시
            return "/asset/image/NB14.png"
        }


        if (stateData.PTY === '0') {  // 강수가 없는경우 하늘상태로 아이콘을 표시
            let date = new Date();
            if (date.getHours() >= 6 && date.getHours() <= 18) { // 대낮인경우
                switch (stateData.SKY) {
                    case "1":
                        return "/asset/image/NB01.png"
                    case "2":
                        return "/asset/image/NB02.png"
                    case "3":
                        return "/asset/image/NB02.png"
                    case "4":
                        return "/asset/image/NB04.png"
                    default:
                        return "/asset/image/NB01.png"
                }
            }
            else {       //밤인경우
                switch (stateData.SKY) {
                    case "1":
                        return "/asset/image/NB01_N.png"
                    case "2":
                        return "/asset/image/NB02_N.png"
                    case "3":
                        return "/asset/image/NB02_N.png"
                    case "4":
                        return "/asset/image/NB04.png"
                    default:
                        return "/asset/image/NB01_N.png"
                }
            }
        }
        else {       // 강수가 있는경우 0 : 없음 / 1 : 비 / 2 : 비눈 / 3 : 눈 / 5 : 빗방울 / 6 : 빗방울눈날림 / 7 : 눈날림 
            switch (stateData.PTY) {
                case "1":
                    return "/asset/image/NB08.png"
                case "2":
                    return "/asset/image/NB12.png"
                case "3":
                    return "/asset/image/NB11.png"
                case "5":
                    return "/asset/image/NB20.png"
                case "6":
                    return "/asset/image/NB22.png"
                case "7":
                    return "/asset/image/NB23.png"
            }
        }
    }

    return (
        <>
            <div className="card">
                <div className="card-header bg-primary text-white text-center mt-3">
                    {locationInfo && (
                        <h4>
                            <b>
                                {locationInfo.level1} {locationInfo.level2} {locationInfo.level3}
                            </b>
                        </h4>
                    )}
                </div>
                <div className="card-body text-center">
                    {

                        stateData.baseDate === undefined ? (<Spinner />) : (
                            <>
                                <div>
                                    <div className="d-flex align-items-center justify-content-center">
                                        <div>
                                            <img src={icon()} style={{ width: "80px" }} />
                                        </div>
                                        <div style={{ marginLeft: "10px" }}>
                                            <h1 style={{ display: "inline-block" }}><b>{stateData.T1H}</b></h1><h3 style={{ display: "inline-block" }}>℃</h3>
                                        </div>

                                        <div style={
                                            {
                                                marginLeft: "40px",
                                                fontSize: ".9rem",
                                                color: "grey",
                                                textAlign: "left",
                                            }
                                        }>
                                            <div>습도 : {stateData.REH}%</div>
                                            <div>{stateData.RN1 === '강수없음' ? stateData.RN1 : "강수 :" + stateData.RN1 + "mm"}</div>
                                            <div>풍향/풍속 : {util.windDegree(stateData.VEC).kor} {stateData.WSD}m/s</div>
                                        </div>
                                    </div>
                                    <div style={
                                        {
                                            marginLeft: "20px",
                                            fontSize: ".9rem",
                                            color: "grey",
                                            textAlign: 'center',
                                        }
                                    }>
                                        <span>{stateData.baseDate.substring(0, 4)}.{stateData.baseDate.substring(4, 6)}.{stateData.baseDate.substring(6, 8)}</span>
                                        <span style={{ marginLeft: ".5rem" }}>{stateData.baseTime.substring(0, 2)}:{stateData.baseTime.substring(2, 4)}</span> 기준
                                    </div>
                                </div>

                            </>
                        )

                    }
                </div>
            </div>
        </>
    );
}