import axios from "axios";
import { useEffect } from "react";
import CovidStatusChart from "./component/CovidStatusChart";
import CovidStatusToday from "./component/CovidStatusToday";
import DateSelector from "./component/DateSelector";

export default function Covid(){
    

    return (
    <>
        <div className="container">
            <div className="card">
                <div className="card-header bg-primary text-center text-white">
                    <DateSelector />
                </div>
                <div className="card-body">
                    <CovidStatusToday />
                    <CovidStatusChart />
                </div>
            </div>
            
        </div>
    </>
    );
}