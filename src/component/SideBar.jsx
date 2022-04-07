import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { action } from '../redux/redux-action';
import { sidebarData } from './sidebar-data';
import styles from './SideBar.module.css';

export default function SideBar(){
    
    const sideBarState = useSelector((s)=>s.sideBarState);
    const dispatch = useDispatch();
    const nav = useNavigate();

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
                {sidebarData.map((item,idx)=>{
                    return (
                        <li className={styles.menu} 
                            key={`menu-key-${idx}`}
                            onClick={()=>{
                                nav(item.href);
                            }}>
                            <span className="ms-2"></span>{item.menuIcon}<b className="ms-2">{item.menuItem}</b>
                        </li>
                    )
                })}
                <li className={styles.lineBar} />
            </ul>
        </nav>
    </>
    );
}