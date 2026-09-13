import { useState,useEffect, useRef} from "react";
import FamInteractPage from "./FamInteractPage.jsx";
import CheckpointChallenge from "./CheckpointChallenge.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import { trackStationProgress,trackWordPairsProgress } from "../utils/userLearningTracker.js";
import {generateAIStory} from "../utils/generateAIStory.js"
import LearningView from "../components/LearningView.jsx";
import { Map } from "lucide-react";

function LearningPage({
    setCurrentPage,
    userInfo,
    stationID,
    stations,
    totalStations,
    onNextStation,
    onCompletedStation}){
        
    const [stationPairs, setStationPairs]= useState([]);
    const [pairIndex, setPairIndex]= useState(0); //keep track among all wordlist
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [story, setStory] = useState(null);
    const [isLoadingStory, setIsLoadingStory] =useState(false);
    
    const [mode, setMode] = useState("learning"); //choices: "learning","famMission","challenge"
    const [isChallengeCompleted, setIsChallengeCompleted] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    
    const currentStation = stations?.find(st => st.station_id === stationID);
    const stationName = currentStation?.station_name || "Unknown station";
    const  currentPair = stationPairs[pairIndex];

    const learningStartTimeRef = useRef(Date.now());
    const learningEndTimeRef = useRef(null);
    const challengeStartTimeRef = useRef(null);

    const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://msccantonese-backend.onrender.com";
    const basePath = `${API_BASE}/api`;

    // Fetch the word pairs for selected station
    useEffect(() => {
        async function fetchStationPairs(){
            try {
                const response = await fetch(`${basePath}/stations/${stationID}/wordpairs`);
                const data = await response.json();
                if (response.ok){
                    setStationPairs(data.wordpairs);
                    setLoading(false);
                }
            }catch (err){
                setError(err);
                setLoading(true);
            }
        }
        fetchStationPairs();
    },[stationID]);

    // Reset learning start time when new station is opened
    useEffect(()=> {
        learningStartTimeRef.current = Date.now();
    },[stationID])
  
    //Record learning progress after completing family mission
    const completeFamMission = async ()=>{
        learningEndTimeRef.current = Date.now();
        
        const learningTimeSpentSeconds = 
        (learningStartTimeRef.current && learningEndTimeRef.current)? 
        ((learningEndTimeRef.current - learningStartTimeRef.current) / 1000).toFixed(2) : 0; //sec

        const wpProgressData ={
            wordpairID: currentPair ? currentPair.id : null,
            userID: userInfo.userID,
            isWordpairCompleted: true,
            learningStartTime: learningStartTimeRef.current,
            learningEndTime: learningEndTimeRef.current,
            learningTotalTime: learningTimeSpentSeconds,
            challengeItemCorrect: null // Will be updated later during challenge
        }

        try {
            await trackWordPairsProgress(wpProgressData);
        } catch (err) {
            console.error("Failed to track progress:", err);
        }

        setMode("learning");
        nextPairs();
    }

    // Calculate time spent learning current word pair
    const nextPairs =()=>{
        if(pairIndex +1 < stationPairs.length){
            setStory(null);
            setPairIndex(prev => prev +1);
            learningStartTimeRef.current = Date.now();
        } else {
            setStory(null);
            setMode("challenge");
        }
    };

    if(loading) return <p>Loading station content...</p>
    if(!currentPair) return <p>No word pairs found for this station.</p>

    // Move to next station or completion page
    const nextStation = ()=>{
        if (stationID < totalStations){
            onNextStation();
            setMode("learning");
            setIsChallengeCompleted(false);
            setPairIndex(0);
        } else {
            setCurrentPage("completionPage");
        }
    }

    // Record progress before returning back to home page
    const backAndTrack = async (pairCompleted, stationCompleted) => {
        if(userInfo){ 
                const currentTime = Date.now();

            // Track station-level progress when leaving during the challenge
            if(mode ==="challenge"){
                const challengeTimeSpentSeconds = 
                challengeStartTimeRef.current ? ((currentTime - challengeStartTimeRef.current) / 1000).toFixed(2) : 0;

                const stProgressData ={
                    stationID: stationID,
                    userID: userInfo.userID,
                    challengeStartTime: challengeStartTimeRef.current,
                    challengeEndTime: currentTime,
                    challengeTotalResponseTime: challengeTimeSpentSeconds,
                    isStationCompleted: stationCompleted,
                    backPhase: mode
                };

                try {
                    await trackStationProgress(stProgressData);
                    if(stationCompleted){
                        console.log("Calling onCompletedStation for", stationID); 
                        onCompletedStation(Number(stationID));
                    }
                } catch (err) {
                    console.error("Failed to track progress:", err);
                }
            } else {
                // Track word-pair and station progress when leaving during learning
                const learningTimeSpentSeconds = 
                    learningStartTimeRef.current ? ((currentTime - learningStartTimeRef.current) / 1000).toFixed(2) : 0;
                
                const wpProgressData ={
                    wordpairID: currentPair ? currentPair.id : null,
                    userID: userInfo.userID,
                    isWordpairCompleted: pairCompleted,
                    learningStartTime: learningStartTimeRef.current,
                    learningEndTime: learningEndTimeRef.current,
                    learningTotalTime: learningTimeSpentSeconds,
                    challengeItemCorrect: null
                };

                const stProgressData={
                    stationID: stationID,
                    userID: userInfo.userID,
                    isStationCompleted: stationCompleted,
                    backPhase: mode
                }

                try {
                    await trackWordPairsProgress(wpProgressData);
                    await trackStationProgress(stProgressData);

                } catch (err) {
                    console.error("Failed to track progress:", err);
                }
            }
        }
        setCurrentPage("homePage");
    }

    // Return directly after completion, otherwise ask for confirmation
    const handleBackOnClick = () => {
        if (isChallengeCompleted){
            backAndTrack(true,true);
            return;
        }
        setIsConfirmOpen(true);
    }

    // Generate a personalised AI story for the current character pair
    const handleStory = async () => {
        if(!userInfo)  
            return;
        setIsLoadingStory(true);
        setStory(null);

        const userInfoForStory = {
            name: userInfo.name,
            age: userInfo.age,
            interest: userInfo.interest,
            wordPair: `${currentPair.charA.chinese} & ${currentPair.charB.chinese}`,
            userID: userInfo.userID,
            wordPairID: currentPair.id
        }
    
        try{
            const result= await generateAIStory(userInfoForStory,(partialStory) => {setStory(partialStory);});
        }catch (err){
            console.error("Failed to load story:", err)
            setStory("Failed to generate story");
        }finally{
            setIsLoadingStory(false);
        }
    }


    return(
    <div className="relative w-full min-h-dvh flex flex-1 flex-col items-center justify-center">
        <header className="top-4 left-4 right-4 shrink-0 absolute">
            <div className="flex justify-between items-center">
                <nav className="relative">
                    <button className="items-center border border-slate-200 bg-white/70 hover:bg-white flex gap-1 text-slate-70 py-2.5 xs:text-xs sm:text-sm " 
                        onClick={handleBackOnClick} aria-label="Back to Map">Back to Map <span><Map/></span></button>
                    <ConfirmModal
                        isOpen={isConfirmOpen}
                        onClose={() => setIsConfirmOpen(false)}
                        onConfirm={() => {
                            setIsConfirmOpen(false);
                            backAndTrack(false,false);
                        }}
                        title="Unsaved Progress"
                        message="Are you sure you want to leave? Your progress for this incomplete pair will not be saved."
                    />
                </nav>
                <h1 className="font-tegomin text-xs sm:text-base md:text-xl text-slate-800 bg-white/70 px-2 py-1 md:px-4 md:py-2 rounded-lg">"{stationName}" Station</h1>
            </div>        
        </header>       

        <div className="w-full flex-1 flex flex-col justify-center items-center">
        { mode==="learning" &&
            <LearningView
               currentPair={currentPair}
               userInfo={userInfo}
               userGroup={userInfo.userGroup}
               onCompleteLearning={()=> setMode("famMission")}
               playAIStory={handleStory}
               story={story}
               setStory={setStory}
               isLoadingStory={isLoadingStory}/>
        }

        {mode === "famMission" &&
            <FamInteractPage 
                currentPair={currentPair}
                completeFamMission={completeFamMission}
                setMode={setMode}
            />
        }

        {mode === "challenge" &&
            <CheckpointChallenge 
                stationPairs = {stationPairs}
                learningStartTime = {learningStartTimeRef.current}
                learningEndTime = {learningEndTimeRef.current}
                challengeStartTimeRef={challengeStartTimeRef}
                userInfo={userInfo}
                stationID={stationID}
                nextStation = {nextStation}
                isChallengeCompleted = {isChallengeCompleted}
                setIsChallengeCompleted = {setIsChallengeCompleted}
                trackStationProgress = {trackStationProgress}
                trackWordPairsProgress={trackWordPairsProgress}
                onCompletedStation={onCompletedStation}
            />
        }
       </div>
    </div>
    )
}

export default LearningPage