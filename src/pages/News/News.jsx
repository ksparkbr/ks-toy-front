import axios from "axios";
import { useEffect, useState } from "react";
import NewsList from "./component/NewsList";

export default function News(){
    
    const [newsList, setNewsList] = useState([]);
    const [dispNews, setDispNews] = useState([]);
    const [firstRendered, setFirstRendered] = useState(false);

    useEffect(() => {
        if(!firstRendered){
            const keywords = ['해킹', '보안취약점', '악성코드', '랜섬웨어'];
            let _newsList = [];
            keywords.forEach((item) => {
                axios.get(process.env.REACT_APP_BACKEND + "/getCyberNews", { params: { keyword: item } })
                    .then((res) => {
                        _newsList = [..._newsList, ...res.data.items];
                        setNewsList(_newsList);
                    })
            })
            setFirstRendered(true);
        }
    }, [])

    useEffect(()=>{
        let _now = new Date();
        let _36HourBefore  = new Date(_now.setHours(_now.getHours() - 48))
        
        setDispNews(newsList.filter((item)=>{
            return (
                new Date(Date.parse(item.pubDate)) > _36HourBefore
            )
        }).sort((a, b)=>{
            if(Date.parse(a.pubDate) < Date.parse(b.pubDate)) return 1;
            else return -1;
        })
        )
    }, [newsList])

    useEffect(()=>{
        console.log(dispNews);
    }, [dispNews])

    return (
    <>
        <div className="container">
            <div className="card">
                <div className="card-header bg-primary text-white text-center">
                    <h4><b>정보보안 뉴스</b></h4>
                </div>
                <div className="card-body">
                    <NewsList data={dispNews} />
                </div>
            </div>
        </div>
    </>
    );
}