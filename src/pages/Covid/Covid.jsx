import axios from "axios";
import { useEffect } from "react";

export default function Covid(){
    useEffect(()=>{
        axios.get(process.env.REACT_APP_BACKEND + "/getCovid").then((res)=>console.log(res.data));

    },[])

    return (
    <>
    
    </>
    );
}