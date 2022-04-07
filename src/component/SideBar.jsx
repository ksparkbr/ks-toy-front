import { useDispatch, useSelector } from 'react-redux';
import { action } from '../redux/redux-action';
import styles from './SideBar.module.css';

export default function SideBar(){
    
    const sideBarState = useSelector((s)=>s.sideBarState);
    const dispatch = useDispatch();

    return (
    <>
        <div className={styles.sideMenuOpenBtn}
            onClick={()=>{
                dispatch(action.TOGGLE_SIDEBAR());
            }}>
            <i className="fas fa-bars"></i>
        </div>
        <nav className={styles.sideBar} style={{width: (sideBarState * 200) + "px"}}>
            <ul>
                <li className={styles.menu}>
                    <i className="fas fa-sun ms-2 me-2" /> <b>날씨</b>
                </li>
                <li className={styles.menu}>
                    <i className="fas fa-viruses ms-2 me-2" /> <b>코로나19</b>
                </li>
                <li className={styles.lineBar} />
            </ul>
        </nav>
    </>
    );
}