import { useState, useEffect, useContext,createContext } from 'react'

import LearningPage from './pages/LearningPage.jsx'
import HomePage from './pages/HomePage.jsx'
import cloudImg from './assets/cloud0.svg' 
import cloudImg1 from './assets/cloud1.svg'
import cloudImg2 from './assets/cloud2.svg' 
import CompletionPage from './pages/CompletionPage.jsx'
import Footer from './components/Footer.jsx'
import {VolumeX,Volume2} from "lucide-react";


export const MusicContext = createContext();

function App() {
  const [openModal, setOpenModal] = useState(false); //driverCardModal
  const USER_GROUP = import.meta.env.VITE_USER_GROUP || "B_advanced"; //load experimental group 
  const [stations, setStations] = useState([]);

  //Restore user info from local storage if available
  const [userInfo, setUserInfo] = useState(() => {
    const saved = localStorage.getItem("userInfo");
    return saved ? JSON.parse(saved) : {
      userID:null,name:"",age:"",interest:"",
      userGroup: USER_GROUP
      };}
    );

  const [currentPage,setCurrentPage] = useState("homePage");  //"homePage","learningPage"
  const [selectStationId, setSelectStationId] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [isMuted, setIsMuted] = useState(false);   
 
  const totalStations = 4;
  const [completedStations, setCompletedStations] = useState([]);

  // Configure the backend API URL
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://msccantonese-backend.onrender.com";
  const basePath = `${API_BASE}/api`;

  // Fetch station data when app first loads
  useEffect(() => {
    async function fetchStations(){
      try {
        const response = await fetch(basePath+"/stations");
        if(!response.ok) throw new Error("Failed to load stations");

        const data = await response.json();
      
        setStations(data.stations);
        setLoading(false);
      } catch (err){
        setError(err.message);
        setLoading(false);
      }
    }
    fetchStations();
  },[]);

  if (loading) return <p>Loading island map...</p>;
  if (error) return <p>Error loading stations: {error}</p>;

  // Update user info and store in local storage
  const handleSetUserInfo =(data) => {
    setUserInfo(data);
    localStorage.setItem("userInfo",JSON.stringify(data));
  };

  // Record complete station(s) for unlocking mechanism
  const handleCompletedStation  = (stationID) => {
    const stID = Number(stationID);
    setCompletedStations(prev => {
      return prev.includes(stID) ? prev : [...prev, stID];
    });
  }


  return (
    <MusicContext.Provider value={{ isMuted, setIsMuted }}>
      <div className="bg-linear-to-b from-sky-200 to-slate-50 relative min-h-dvh w-full">
        <div className="pointer-events-none"  aria-hidden="true">
          <img src={cloudImg} alt="" className="w-1/4 absolute top-10 left-5 z-0 opacity-80 "></img>
          <img src={cloudImg1} alt="" className="w-1/4 absolute bottom-15 left-10 z-0 opacity-90"></img>
          <img src={cloudImg2} alt="" className="w-1/4 absolute top-1/3 right-10 z-0 opacity-90"></img>
        </div>

        {/* background music */}
        <audio autoPlay loop muted={isMuted}>
          <source src="./music/ChildrenMusic.mp3" type="audio/mpeg" />
        </audio>

        {/* music control button */}
        <button onClick={() => setIsMuted(!isMuted)} aria-label="Toggle background music"
          className="fixed top-16 right-4 bg-white/70 p-2 rounded-full hover:bg-white z-50">
          {isMuted ? <VolumeX/> : <Volume2/>}
        </button>


        <main className="relative z-10 min-h-dvh flex flex-col items-center justify-center">
          {currentPage === "homePage" && (
            <HomePage
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              openModal={openModal}
              setOpenModal={setOpenModal}
              setCurrentPage={setCurrentPage}
              stations={stations}
              setSelectStationId={setSelectStationId}
              completedStations={completedStations}
              handleSetUserInfo={handleSetUserInfo}
              USER_GROUP={USER_GROUP}
            />

            )}


          {currentPage === "learningPage" &&
            <LearningPage 
              setCurrentPage={setCurrentPage} 
              userInfo={userInfo}
              stationID={selectStationId}
              stations={stations}
              totalStations={totalStations}
              onNextStation = {() => setSelectStationId (prev => prev +1)}
              onCompletedStation={handleCompletedStation}
            /> 
          }

          {currentPage === "completionPage" &&
            <CompletionPage
              userInfo={userInfo}
              setCurrentPage={setCurrentPage}
            />
          }
            
        </main>
        <Footer/>
      </div>
    </MusicContext.Provider>
  )
}

export default App