import styles from '../Weather.module.css'
import { searchLocate } from '../../../database/search-locate';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { action } from '../../../redux/redux-action';

export default function LocationSelector() {

    const [lvl1List, setLvl1List] = useState([]);
    const [lvl2List, setLvl2List] = useState([]);
    const [lvl3List, setLvl3List] = useState([]);

    const [lvl1, setLvl1] = useState('');
    const [lvl2, setLvl2] = useState('');
    const [lvl3, setLvl3] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        setLvl1List(searchLocate.level1());
        dispatch(action.SET_LOC_NULL());
    }, [])

    useEffect(() => {
        dispatch(action.SET_LOC_INFO(searchLocate.search(lvl1, lvl2, lvl3)));
    }, [lvl1, lvl2, lvl3])

    useEffect(() => {
        if (lvl1 !== '') {
            setLvl2('');
            setLvl3('');
            setLvl2List([]);
            setLvl3List([]);
            document.getElementById("select-lvl2").selectedIndex = 0;
            setLvl2List(searchLocate.level2(lvl1));
        }
    }, [lvl1])

    useEffect(() => {
        if (lvl1 !== '' && lvl2 !== '') {
            setLvl3('');
            setLvl3List([]);
            document.getElementById("select-lvl3").selectedIndex = 0;
            setLvl3List(searchLocate.level3(lvl1, lvl2));
        }
    }, [lvl2])

    return (
        <>
            <div className="bg-primary rounded p-2 mt-2">
                <div className="input-group justify-content-center flex-wrap">
                    <span className="input-group-text text-white">
                        지역선택
                    </span>
                    <select
                        id="select-lvl1"
                        className={styles.locationSelector}
                        onChange={(e) => {
                            setLvl1(e.target.value)
                        }}>
                        <option value=''>시/도</option>
                        {
                            lvl1List.length > 0 && lvl1List.map((item, idx) => {
                                return (
                                    <option
                                        key={`lvl1-option-${idx}`}
                                        value={item}
                                    >
                                        {item}
                                    </option>
                                )

                            })
                        }
                    </select>
                    <select
                        id="select-lvl2"
                        className={styles.locationSelector}
                        onChange={(e) => {
                            setLvl2(e.target.value);
                        }}
                    >
                        <option value=''>시/군/구</option>
                        {
                            lvl2List.length > 0 && lvl2List.map((item, idx) => {
                                return (
                                    <option
                                        key={`lvl2-option-${idx}`}
                                        value={item}
                                    >
                                        {item}
                                    </option>

                                )
                            })
                        }
                    </select>
                    <select
                        id="select-lvl3"
                        className={styles.locationSelector}
                        onChange={(e) => {
                            setLvl3(e.target.value);
                        }}
                    >
                        <option value=''>읍/면/동</option>
                        {
                            lvl3List.length > 0 && lvl3List.map((item, idx) => {
                                return (
                                    <option
                                        key={`lvl3-option-${idx}`}
                                        value={item}
                                    >
                                        {item}
                                    </option>

                                )
                            })
                        }
                    </select>
                </div>

            </div>
        </>
    );
}