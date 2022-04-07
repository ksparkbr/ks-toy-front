import { useEffect } from "react";
import { useSelector } from "react-redux";
import FcstSrt from "./component/FcstSrt";
import LocationSelector from "./component/LocationSelector";
import VilageFcst from "./component/VilageFcst";

export default function Weather() {

    const locationInfo = useSelector((s)=>s.locationInfo);

    useEffect(()=>{
        //if(locationInfo.x != null && locationInfo.y != null){
            //console.log(locationInfo);
        //}
    },[locationInfo])

    return (
        <>
            <div className="container">
                <LocationSelector />
                <FcstSrt />
                <VilageFcst />
            </div>
        </>
    );
}