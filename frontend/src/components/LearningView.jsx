import {useState, useRef} from "react";
import CharacterCard from "./CharacterCard.jsx";
import StrokeViewer from "./StrokeViewer.jsx";
import {playAudio} from "../utils/playAudio.js"
import {playStoryAudio} from "../utils/playStoryAudio.js"
import { Volume2, LampDesk, Eye ,EyeClosed, RefreshCcw, ThumbsUp , BoomBox,CirclePause} from 'lucide-react';


function LearningView ({currentPair, userInfo, userGroup, story, setStory, isLoadingStory, onCompleteLearning, playAIStory}){
    const [isFlipped, setIsFlipped] = useState(false); //if char card is flipped
    const [isHighlighted, setIsHighlighted] = useState(false);
    const [isLoadingStoryAud, setIsLoadingStoryAud] = useState(false);
    const [isPlayingStoryAud, setIsPlayingStoryAud] = useState(false);
    const storyAudioRef = useRef(null);

    // Separate the generated story from its mnemonic tip
    const parts = story ? story.split("Mnemonic tip: "):"";
    const storyPart = parts? parts[0].trim():"";
    const mnemonicPart = parts[1] ? "Mnemonic tip: " + parts[1].trim() : "";


    const handleStoryAudio = async () => {
        if(!story)
          return;

       if (storyAudioRef.current) {
        if (isPlayingStoryAud) {
            storyAudioRef.current.pause();
            setIsPlayingStoryAud(false);
        } else {
            storyAudioRef.current.play();
            setIsPlayingStoryAud(true);
        }
        return;
        }

        try {
            setIsLoadingStoryAud(true);
            const audio = await playStoryAudio(story); //testStory
            
            if (audio) {
                storyAudioRef.current = audio;
                setIsPlayingStoryAud(true);
                audio.onended = () => {setIsPlayingStoryAud(false)};
                }
            } catch (err){
                console.error(err);
            } finally {
                setIsLoadingStoryAud(false);
            } 
        }

    

    return (
        <main className="flex flex-col w-full gap-2 min-h-0 mx-auto py-3 md:py-4 px-2">
            {/* Character comparison and stroke learning */}
            <section className="flex flex-col items-center gap-1 md:gap-3 min-h-0">
                <h2 className="font-tegomin text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-20 md:mt-5 shrink-0">
                    <span className="bg-amber-50 rounded-full px-2 py-0.5">{currentPair.charA.chinese}</span> & <span className="bg-amber-50 rounded-full px-2 py-0.5">{currentPair.charB.chinese}</span>
                </h2>

                {isHighlighted &&
                <div className="flex mt-3 md:mt-5 md:-mb-5 gap-1 justify-center items-center rounded-sm bg-white/60  text-amber-950 px-3 py-1.5 md:px-5 shadow-sm border-2 border-amber-300 my-2 mx-auto">
                    <span className="p-1 md:p-1.5 bg-amber-100/40 rounded-xl"><LampDesk/></span>
                    <p className="font-tegomin flex flex-col gap-1"> 
                        <span className=" text-sm tracking-wider">HINTS: </span> 
                        <span className="  text-slate-800 md:text-lg">{currentPair.diffHint}</span></p>
                </div>
                }

                {!isFlipped &&
                <div className="flex flex-col md:flex-row min-h-0 flex-1 m-2.5 md:m-5 gap-2 md:gap-4 object-contain">
                    <div className="flex md:flex-col items-center min-h-0 gap-2 md:gap-3 w-full ">
                        <StrokeViewer 
                            character = {currentPair.charA.chinese}
                            isHighlighted = {isHighlighted}
                            highlightStrokes={currentPair.charAHighlight}/>
                        <div className="flex flex-col  gap-1 md:gap-2  items-center justify-center">
                            <button className="flex items-center gap-1.5 px-3 py-3 md:p-4 text-xs md:text-sm" aria-label="listen the pronunciation of character A"
                                    onClick={()=> playAudio(currentPair.charA.chinese)}>Listen<span ><Volume2 /></span> </button>
                            <div className="flex flex-col items-center justify-center gap-1 mt-1 mb-2 font-tegomin " >
                                <span className="text-xs  text-slate-400 font-bold tracking-wider">ENGLISH</span>
                                <h1 className="text-3xl md:text-4xl text-center text-slate-800">{currentPair.charA.english}</h1>
                            </div>
                            
                        </div> 
                    </div>

            

                    <div className="flex md:flex-col items-center gap-2 md:gap-3  w-full">
                        <StrokeViewer 
                            character = {currentPair.charB.chinese}
                            isHighlighted = {isHighlighted}
                            highlightStrokes={currentPair.charBHighlight}/>
                        <div className="flex flex-col gap-1 md:gap-2 items-center justify-center">
                            <button className="flex items-center gap-1.5 px-3 py-3 md:p-4 text-xs md:text-sm" aria-label="listen the pronunication of character B"
                                    onClick={()=> playAudio(currentPair.charB.chinese)}>Listen<span ><Volume2 /></span> </button>
                            <div className="flex flex-col items-center justify-center gap-1 mt-1 mb-2 font-tegomin " >
                                <span className="text-xs text-slate-400 tracking-wider">ENGLISH</span>
                                <h1 className="text-3xl md:text-4xl text-center text-slate-800">{currentPair.charB.english}</h1>
                            </div>
                            
                        </div>
                    </div>
                </div> 
                }   
            </section>     

            {/* Character information cards */}
            {isFlipped &&
                <section className="flex flex-col md:flex-row min-h-0 ">
                    <div className="flex flex-col md:flex-row items-center justify-center my-5 md:my-8 gap-10 md:gap-20 w-full ">
                        <CharacterCard character = {currentPair.charA} />
                        <CharacterCard character = {currentPair.charB} />
                    </div>  

                    
                </section>
            }

            {/* AI storytelling feature for the experimental group */}
            {userGroup === "B_advanced" &&
                        <div className="flex flex-col items-center gap-2 shrink-0">
                            {!story && (
                            <>
                                <p className="font-tegomin bloc text-red-800">Click for an AI Story!📖</p>
                                <button className="bg-red-200 hover:bg-red-300 " aria-label={isLoadingStory ? "Generating story":"story time"}
                                    onClick= {()=> playAIStory()} disabled={isLoadingStory}> 
                                    {isLoadingStory ? "Generating story..." : "Story time!" }</button>
                            </>
                            )}
                            

                            {story && (
                                <div className="flex flex-col bg-pink-100/80 items-center gap-2 w-full max-w-6xl rounded-lg shrink-0 font-tegomin p-3">
                                    <h3 className="mt-1 text-lg">Story Time!</h3>
                                    <p className="text-base text-gray-700 ">{storyPart}</p>
                                    {mnemonicPart && (
                                        <p className="text-base text-gray-700 italic">{mnemonicPart}</p>
                                    )}
                                    <div className="flex flex-row gap-2">
                                        <button className="text-md my-2 bg-red-200 hover:bg-red-300 px-3 py-2" aria-label="Closes"
                                            onClick={() => setStory(null)} > Closes </button>
                                        <button className="text-md my-2 bg-red-300 hover:bg-red-400 px-4 py-2 rounded-lg  gap-1 transition-all"
                                            onClick={handleStoryAudio} disabled={isLoadingStoryAud} aria-label=""> 
                                            {!isLoadingStoryAud && !isPlayingStoryAud && <div className="flex gap-1"><BoomBox/>Read Aloud</div>}
                                            {isLoadingStoryAud && "Loading audio..."}
                                            {!isLoadingStoryAud && isPlayingStoryAud && <div className="flex gap-1"><CirclePause/>Pause reading</div>}
                                        </button>    
                                    </div>
                                </div>
                            )}
                        </div>
                    }
                                        

            <section className="flex flex-col items-center gap-2.5 md:gap-5 min-h-0 shrink-0 pt-2">
                
                
                <button className="flex gap-2" onClick={()=> setIsFlipped(!isFlipped)} aria-label="flip card for more infomation"><span>
                    <RefreshCcw /></span>Flip Card for more information</button>
                <div className="flex gap-5"> 
                    <button className={`px-4 py-2 transition-all text-sm cursor-pointer flex items-center gap-2 ${
                                isHighlighted ? "bg-amber-200 text-amber-900  hover:bg-amber-100": "bg-amber-100 hover:bg-amber-200"}`} 
                            onClick={() => setIsHighlighted(!isHighlighted)} aria-label={isHighlighted ? "hide differences" : "hightlight differences"}>
                                {isHighlighted ? (
                                    <><EyeClosed size={18} /><span>Hide Differences</span></>) : (
                                    <><Eye size={18} /><span>Highlight Differences</span></>)}
                    </button>
                    <button className="flex gap-2 bg-purple-200 hover:bg-purple-300" aria-label="Ok learned"
                        onClick={()=> onCompleteLearning()}><span><ThumbsUp /></span>OK! Learned!</button>
                </div>
            </section>

            </main>
    );

}
export default LearningView