import {useRef, useEffect, useState} from "react";
import { SquarePlay, Pencil } from "lucide-react";
import HanziWriter from "hanzi-writer";

function StrokeViewer({character, highlightStrokes =[], isHighlighted}){
    // Store references to the drawing container and HanziWriter instance
    const strokeBoxRef = useRef(null); 
    const writerRef = useRef(null); //keep track of the writer

    // Create a new HanziWriter instance whenever the character changes
    useEffect(() => {
        if (strokeBoxRef.current){
            strokeBoxRef.current.innerHTML =""; //reset content

            writerRef.current = HanziWriter.create(strokeBoxRef.current,character,{
                width: 150,
                height: 150,
                padding: 10,
                showOutline: true,
            });
        }     
    }, [character]);

    // Show highlighted strokes when hightlighting is enabled
    useEffect(()=> {
        if(isHighlighted){
        const runStrokeAnimate = async () => {
            writerRef.current.updateColor("outlineColor","#555");
            writerRef.current.updateColor("strokeColor","#AAF");
            writerRef.current.hideCharacter();
            for (const strokeNum of highlightStrokes){
                if (typeof strokeNum === "number"){
                    await writerRef.current.animateStroke(strokeNum);
                }
            }
        };
        runStrokeAnimate();
        } else {
            writerRef.current.updateColor("outlineColor","#DDD");
            writerRef.current.updateColor("strokeColor","#555");
            writerRef.current.showCharacter();
        }
    }, [isHighlighted,highlightStrokes]);
    
    // Play stroke order animation
    const handlePlayAnimation = () => {
        if (writerRef.current){
            if (isHighlighted) {
                writerRef.current.updateColor("strokeColor", "#555");
                writerRef.current.updateColor("outlineColor", "#DDD");
            }
            writerRef.current.animateCharacter();
        }
    }

    // Start HanziWriter handwriting mode
    const handleHandWriting = () =>{
    if(writerRef.current){
        writerRef.current.updateColor("outlineColor","#DDD");
        writerRef.current.updateColor("strokeColor","#555");
        writerRef.current.quiz();
    }
    }

    return(
        <div className="flex flex-col items-center gap-4 bg-white rounded-2xl w-fit shadow-md max-h-[85vh] p-3 sm:p-5 shrink min-h-0 justify-between">
            <div className="relative w-37.5 h-37.5 border rounded-lg border-slate-300 overflow-hidden bg-slate-50">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" id="grid-background-target">
                    <line x1="0" y1="0" x2="100" y2="100" stroke="#DDD" />
                    <line x1="100" y1="0" x2="0" y2="100" stroke="#DDD" />
                    <line x1="50" y1="0" x2="50" y2="100" stroke="#DDD" />
                    <line x1="0"  y1="50" x2="100" y2="50" stroke="#DDD" />
                </svg>
                <div ref={strokeBoxRef} className="absolute inset-0 z-50"/>
            </div>
            <button className="flex gap-1 font-digital bg-emerald-100 p-5 rounded-xl px-4 py-2 sm:py-3.5 sm:text-sm hover:bg-emerald-200 cursor-pointer shadow-sm" 
                onClick={handlePlayAnimation} aria-label="play stroke animation"><span><SquarePlay /></span> Play Stroke Animation</button>
            <button className="flex gap-2 font-digital bg-emerald-200 p-5 rounded-xl px-4 py-2 sm:py-3.5 sm:text-sm hover:bg-emerald-300 cursor-pointer shadow-sm" 
                onClick={handleHandWriting} aria-label="handwriting practice"><span><Pencil /></span> Handwriting Practice</button>
        </div>
    )
}

export default StrokeViewer