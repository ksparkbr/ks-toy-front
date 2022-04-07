import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Navigate, Route, Router, Routes } from 'react-router-dom';
import Weather from './pages/Weather/Weather';
import SideBar from './component/SideBar';
import { useSelector } from 'react-redux';

function App() {
  const sideBarState = useSelector((s)=>s.sideBarState);

  return (
    <>
      <SideBar />
      <main className="app" style={{paddingLeft: (sideBarState * 200) + "px"}}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/weather" />} />
            <Route path="/weather" element={<Weather />} />
          </Routes>
        </BrowserRouter>
      </main>
    </>
  );
}

export default App;
