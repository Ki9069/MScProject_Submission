import DriverCardModal from "../components/DriverCardModal"
import ukLand from "../assets/island.svg" 
import londonBus from '../assets/londonbus.svg'
import {Bus,Divide,Lock} from "lucide-react";
import shortbs from "../assets/shortbs.svg" 


function HomePage({
    userInfo,
    openModal,
    setOpenModal,
    setCurrentPage,
    stations,
    setSelectStationId,
    completedStations,
    handleSetUserInfo,
    USER_GROUP}){
  
    // Set station by ID and navigate to learning page
    const handleSelectStation = (stationID) => {
        setSelectStationId(stationID);
        setCurrentPage("learningPage");
    };

    // Position each station button on map
    const stationsPosition = {
        1: {top: "30%", left: "45%"},
        2: {top: "55%", left: "50%"},
        3: {top: "45%", left: "55%"},
        4: {top: "65%", left: "60%"},
    };


    return(
        <section className="flex flex-col md:flex-row min-h-full w-full overflow-y-auto items-center justify-center py-10 gap-2 pb-10">
            <div className="flex flex-col">
            {/* Welcome section */}
            <header className="flex flex-col items-center text-center md:text-left md:-mr-10 font-tegomin">
                {userInfo.name !=="" ? (
                    <div className="flex flex-col items-center font-tegomin ">
                        <h1 className="text-4xl md:text-5xl leading-15 mb-5 text-slate-900 drop-shadow-md text-center whitespace-normal">
                            Welcome, <span className="block">Driver <span className="bg-linear-to-r from-blue-700 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">{userInfo.name || ""}</span>!</span>
                        </h1>
                        <div className="bg-white/40 text-center rounded-lg px-4 py-2">
                            <p className="text-lg md:text-xl mb-3">🚌 Your journey starts here!</p>
                            <p className="text-base md:text-lg text-slate-700 max-w-md mb-4 text-center">Visit each bus stop to learn
                                <br /><span className="underline decoration-1 underline-offset-2">3 pairs of look-alike Chinese characters.</span></p>
                            <p className="text-base md:text-lg text-slate-700">📚 Learn → 🎮 Play → 🔓 Unlock → 🚌 Move on!</p>
                        </div>
                    </div>
                ):(
                    <div className="flex flex-col items-center gap-3 text-center">{/* c */}
                        <h1 className="text-4xl md:text-5xl">Welcome to 
                            <span className="outline text-5xl md:text-7xl block mb-5 bg-linear-to-r from-blue-700 to-purple-500 bg-clip-text text-transparent drop-shadow-lg" lang="zh">字遊廣東話</span></h1>
                        <h2 className="mx-3 font-tegomin">Master Cantonese by spotting the tiny differences in look-alike characters</h2>
                        <p className="text-sm md:text-md mx-3 mr-5 mb-2 font-tegomin text-blue-800">Press the button below to start your journey! </p>
                        <button onClick={ () => setOpenModal(true)} aria-label="Start"
                            className="w-fit text-3xl rounded-xl flex gap-2 mb-5 relative z-10 font-digital bg-amber-200 p-5 hover:bg-amber-300 border-b-4 text-blue-800 cursor-pointer shadow-sm">
                            <span className="">Start</span>
                            <Bus size={35} className=""/>
                        </button>
                    </div>
                )}    
            </header> 
            </div>
                
            {/* Map and station navigation*/}
            <section className="relative w-full max-w-xl md:-ml-10 aspect-square flex items-center justify-center">
                <img src={ukLand} alt="Outline of the UK" className="w-full h-full object-contain z-10 relative"></img>

                {!userInfo.name &&
                    <div className="absolute w-1/3 z-20 mt-60 mr-20 animate-[driveIn_1.5s_ease-out]">
                        <img src={londonBus} alt="Red double-decker London bus" className="transition-transform duration-300 hover:translate-x-3 hover:scale-110"/>
                    </div> 
                }

                {userInfo.name !== "" && (
                    <nav>
                    {stations.map((st) => {
                        const pos = stationsPosition[st.station_id]
                        const isStationUnlocked = st.station_id === 1 || completedStations.includes(Number(st.station_id-1))
                        return (
                            <button key={st.station_id} 
                                onClick={() => handleSelectStation(st.station_id)}
                                style = {{top:pos.top, left: pos.left}}
                                className ="btn-reset absolute z-20 flex items-center cursor-pointer"
                                aria-label={`${st.station_name},${isStationUnlocked ? "unlocked" : "locked"}`}
                                disabled={!isStationUnlocked}>
                                <img src={shortbs} alt="a Bus stop" className="w-15 h-15"/>
                                    <div className="flex gap-1">
                                        <span className={`font-tegomin text-blue-950 p-0.5 xs:text-xs sm:text-sm md:text-base ${isStationUnlocked? "bg-amber-100/80" : "bg-gray-200/80"}`}>{st.station_name}</span>
                                        <span>{isStationUnlocked ? <Bus/> : "🔒"}</span>
                                    </div>
                            </button>
                        );
                    })}
                    </nav>
            )}       
            </section>
        
            { openModal && (
                <DriverCardModal 
                    userInfo = {userInfo}
                    setUserInfo = {handleSetUserInfo}
                    setOpenModal = {setOpenModal}
                    USER_GROUP ={USER_GROUP}
                />
            )} 
        </section>
    )
}

export default HomePage