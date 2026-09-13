import { LampDesk } from 'lucide-react';
import {useState,useEffect,useRef} from 'react';
import FeedbackModal from '../components/FeedbackModal.jsx';
import hkBus from '../assets/hkbus.svg'
import busStop from '../assets/busstop.svg'

function CheckpointChallenge({
    stationPairs,
    challengeStartTimeRef,
    userInfo,
    stationID,
    nextStation,
    isChallengeCompleted,
    setIsChallengeCompleted,
    trackStationProgress,
    trackWordPairsProgress,
    onCompletedStation}){

    const [quizPairsIndex,setQuizPairsIndex] = useState(0);
    const [isCorrect,setIsCorrect] = useState(false);
    const [isTargetB,setIsTargetB] = useState(() => Math.random()<0.5); //shuffle question char
    const [isOrderFlipped, setIsOrderFlipped] = useState(() => Math.random()<0.5); //shuffle button
    const [showHints, setShowHints] =useState(false);
    const [modalCheck, setModalCheck] = useState({ isOpen: false, isCorrect: false});

    // Track challenge performance
    const totalWrongAttemptsRef = useRef(0);
    const firstTryCorrectCountRef = useRef(0);
    const isFirstAttemptRef = useRef(true);

    // Record the challenge start time 
    useEffect(()=> {
        challengeStartTimeRef.current = Date.now();
    },[]);

    // Mark the challenge as completed after all word pairs have been answered
    useEffect(()=> {
        if (quizPairsIndex >= stationPairs.length){
            setIsChallengeCompleted(true);}
    },[quizPairsIndex,stationPairs.length,setIsChallengeCompleted]);

    // Send station-level challenge results when challenge is completed
    useEffect(()=>{
        const sendStationProgress = async () => {
        if(isChallengeCompleted){

            const challengeEndTime = Date.now();
            
            const totalChallResponseTimeSeconds = 
            challengeStartTimeRef.current ? ((challengeEndTime - challengeStartTimeRef.current) / 1000).toFixed(2) : null;
    
            const stProgressData = {
                userID: userInfo.userID,//userData
                userGroup: userInfo.userGroup,
                stationID: stationID,
                challengeStartTime: challengeStartTimeRef.current,
                challengeEndTime: challengeEndTime,
                challengeTotalResponseTime: totalChallResponseTimeSeconds,
                isStationCompleted: true,
                firstTryCorrectCount: firstTryCorrectCountRef.current,
                totalWrongAttempts: totalWrongAttemptsRef.current,
                };
                
            try {
                    await trackStationProgress(stProgressData);
                } catch (err) {
                    console.error("Failed to track station progress:", err);
                }
            }
        };
        sendStationProgress();
    },[isChallengeCompleted,
        userInfo, 
        stationID])

    // Record challenges completed and move to next station    
    const handleCompleteChallenge = () => {
        setIsChallengeCompleted(false);
        nextStation();
        onCompletedStation(stationID);
    }

    if (!stationPairs ||quizPairsIndex >= stationPairs.length){  
        return(
            <div className="flex flex-col w-full min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8 gap-4">
                <div className="flex gap-2 items-center justify-center">
                    <img src={busStop} alt="a bus stop" className="w-1/11"></img>
                    <img src={hkBus} alt="an old style of a Hong Kong bus" className="w-3/5"></img>
                </div>
                <p className="bg-white/60 p-0.5 font-tegomin m-0.5 text-red-900"> Fun Fact: This is a retired, un-air-conditioned bus in Hong Kong. We call it a 'hot dog' bus!</p>
                <h1 className="block font-tegomin text-3xl md:text-4xl outline  mb-5 bg-linear-to-r from-blue-700 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">Well Done! </h1>
                <h2 className="font-tegomin text-xl md:text-2xl">You've arrived at this station! Take a break or.. </h2>
                <button onClick={() =>  handleCompleteChallenge()} aria-label="carry on to next station">Carry on to Next Station!</button>
            </div>);  
    }     

    const currentQuizPairs = stationPairs[quizPairsIndex];
    // Randomised target quiz character and button
    const targetChar = isTargetB ? currentQuizPairs.charB : currentQuizPairs.charA;
    const leftChar = isOrderFlipped ? currentQuizPairs.charB : currentQuizPairs.charA;
    const rightChar = isOrderFlipped ? currentQuizPairs.charA : currentQuizPairs.charB;

    // Check selected answer and record challenge performance
    const handleAnswer = async (selectedChar) => {
        const correct = selectedChar.chinese === targetChar.chinese;
        setIsCorrect(correct);

        if(correct){
            if(isFirstAttemptRef.current){
                firstTryCorrectCountRef.current +=1;
            }

            try{
                await trackWordPairsProgress({
                    wordpairID: currentQuizPairs.id,
                    userID: userInfo.userID,
                    isWordpairCompleted: true,
                    challengeItemCorrect: isFirstAttemptRef.current
                })
            } catch (err) {
                console.error("Failed to track question progress:" , err);
            }
            setModalCheck({ isOpen: true, isCorrect: true });
        }
        else {
            // Record a wrong attempt and show the visual hint
            setModalCheck({ isOpen: true, isCorrect: false });
            totalWrongAttemptsRef.current += 1;
            isFirstAttemptRef.current = false;
            setShowHints(true);
        }
    }

    // Move to the next question after a correct answer
    const handleCloseModal = () => {
        const wasCorrect = modalCheck.isCorrect;
        setModalCheck({ isOpen: false, isCorrect: false });

        if (wasCorrect) {
            isFirstAttemptRef.current = true;
            setQuizPairsIndex(prev => prev + 1);
            setIsOrderFlipped(Math.random() < 0.5);
            setIsTargetB(Math.random() < 0.5);
            setShowHints(false);
        }
    };

    return (
    <>
    <div className="flex w-full justify-center flex-col items-center font-tegomin select-none"> 
        <header className="flex flex-col text-center gap-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl">Mini Boss Challenge!</h1>
            <p className="mb-3">Here is the Mini Boss Challenge to clear this station, Driver {userInfo.name}! 🚌⚔️</p>
        </header>

        <section className="bg-white/95 rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-amber-200/80 max-w-lg w-full flex flex-col items-center gap-6">
            <div className="text-lg sm:text-xl text-slate-700 text-center">
                <span className="font-digital text-xs sm:text-sm text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                    QUESTION {quizPairsIndex + 1} OF {stationPairs.length}
                </span>
                
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/60">
                    <div className="bg-amber-400 h-full transition-all duration-300 rounded-full" style={{ width: `${((quizPairsIndex + 1) / stationPairs.length) * 100}%` }}/>
                </div>

                <p className="text-slate-500 text-sm sm:text-base mb-1"> Please choose the correct character for: <span className="text-2xl">{targetChar.english}</span></p>
            </div>
            <div className="flex gap-10 ">
                <button className="font-tegomin flex-1 p-4 text-5xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-2xl cursor-pointer shadow-sm" 
                    onClick={()=> handleAnswer(leftChar)} aria-label={leftChar.chinese}>{leftChar.chinese}</button>
                <button className="font-tegomin flex-1 p-4 text-5xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-2xl cursor-pointer shadow-sm" 
                onClick={()=> handleAnswer(rightChar)} aria-label={rightChar.chinese}>{rightChar.chinese}</button>  
            </div>

            {showHints && 
                <aside className="w-full bg-purple-50/80 border-2 border-purple-200 rounded-2xl p-4 text-slate-700 text-sm sm:text-base leading-relaxed flex items-start gap-3 shadow-sm">
                    <span className="text-xl"><LampDesk/></span>
                    <div>
                        <p className="block text-purple-900 font-bold mb-0.5">Hint:</p>
                        <p >{currentQuizPairs.diffHint}</p>
                    </div>
                </aside>
            }
        </section>

        {modalCheck.isOpen &&
            <FeedbackModal 
            isOpen={modalCheck.isOpen}
            isCorrect={modalCheck.isCorrect}
            onClose={handleCloseModal}/>
        }
    </div>
  </>
    )
}

export default CheckpointChallenge