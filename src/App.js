import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Navigate, Route, Router, Routes } from 'react-router-dom';
import Weather from './pages/Weather/Weather';
import SideBar from './component/SideBar';
import { useSelector } from 'react-redux';
import Covid from './pages/Covid/Covid';
import CovidLive from './pages/CovidLive/CovidLive';
import News from './pages/News/News';

function App() {
  const sideBarState = useSelector((s)=>s.sideBarState);

  return (
    <>
        <BrowserRouter>
          <SideBar />
          <main className="app" style={{paddingLeft: (sideBarState * 200) + "px"}}>
          <Routes>
            <Route path="/" element={<Navigate to="/weather" />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/covid19" element={<Covid />} />
            <Route path="/covidLive" element={<CovidLive />} />
            <Route path="/news" element={<News />} />
          </Routes>
          </main>
        </BrowserRouter>
      
    </>
  );
}

export default App;
