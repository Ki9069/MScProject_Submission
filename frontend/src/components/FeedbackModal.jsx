import { ArrowBigRight, PartyPopper, LandPlot } from "lucide-react";
import { createPortal } from "react-dom";

function FeedbackModal({ isOpen, isCorrect, onClose }) {

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex z-50 items-center justify-center">
      
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="relative flex flex-col items-center z-10 w-full max-w-md md:max-w-xl bg-white shadow-2xl border border-sky-100 rounded-2xl p-6 gap-6">
        
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-digital text-center flex items-center justify-center gap-2">
          {isCorrect ? <span className="flex gap-1"><PartyPopper /> EXCELLENT!</span> : <span className="flex gap-2"><LandPlot /> KEEP GOING!</span>}
        </h2>

        {/* Content */}
        <div className="w-full px-6 py-5 border-2 border-slate-200 flex flex-col items-center gap-3 text-md text-slate-700 rounded-lg text-center">
          <div className="text-5xl my-1">
            {isCorrect ? "🌟" : "🤔"}
          </div>
          <p className="text-xl font-bold text-slate-800 font-digital">
            {isCorrect ? "Correct Answer!" : "Not Quite Right"}
          </p>
          <p className="text-slate-600 text-base leading-relaxed text-tegomin">
            {isCorrect 
              ? "Great job matching the character! Ready for the next one?" 
              : "Take a quick look at the hint on screen and try again!"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-6 md:gap-10 text-xl md:text-2xl font-digital w-full justify-center">
          <button 
            className="bg-amber-200 px-6 py-4 rounded-xl hover:bg-amber-300 cursor-pointer shadow-sm transition-all"
            onClick={onClose} aria-label={isCorrect ? "Next Question": "Got it"}> 
            {isCorrect ? <div className="flex gap-1">Next Question <ArrowBigRight/></div> : "Got it "}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default FeedbackModal;