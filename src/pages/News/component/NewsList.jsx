import styles from '../News.module.css'

export default function NewsList({ data }) {
    const openWin = (url) => {
        window.open(url, "popup");
    }

    return (
        data !== null && data.length > 0 && data.map((item, idx) => {
            return (
                <div className={styles.newsArticle} key={`news-list-idx-${idx}`}>
                    <div className="d-flex justify-content-between">
                        <div className="d-flex mb-1 align-items-center">
                            <div className={styles.newsTitle}
                                onClick={() => openWin(item.link)}
                                dangerouslySetInnerHTML={{ __html: item.title }} />
                            <div className={styles.newsPubdate}>{new Date(Date.parse(item.pubDate)).toLocaleString()}</div>
                        </div>
                        <div className={styles.newsLink} onClick={() => openWin(item.link)}>
                            {item.link}
                        </div>
                    </div>
                    <div className={styles.newsDiscription}
                    dangerouslySetInnerHTML={{__html: item.description}} />
                    <hr />
                </div>
            )
        })
    )
}