import { createPortal } from "react-dom";
import { AlertCircle } from "lucide-react";

function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex z-50 items-center justify-center">
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative flex flex-col items-center z-10 w-full max-w-md md:max-w-xl bg-white shadow-2xl border border-sky-100 rounded-2xl p-6 gap-6">
        
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-digital text-center flex items-center justify-center gap-2 text-slate-800">
          <AlertCircle className="w-7 h-7 text-pink-900" /> {title || "ARE YOU SURE?"}
        </h2>

        {/* Content Box */}
        <div className="w-full px-6 py-5 border-2 border-slate-200 flex flex-col items-center gap-3 text-slate-700 rounded-lg text-center">
          <div className="text-5xl my-1">🗺️</div>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-tegomin">
            {message || "Are you sure you want to leave? Your progress for this incomplete pair will not be saved."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 sm:gap-6 text-lg sm:text-xl font-digital w-full justify-center">
          <button onClick={onClose} aria-label="Cancel"
            className="bg-slate-100 border border-slate-200 text-slate-700 px-6 py-3.5 rounded-xl hover:bg-slate-200 cursor-pointer shadow-sm transition-all flex-1 max-w-[160px]">
            Cancel
          </button>
          
          <button onClick={onConfirm} aria-label="Yes, Leave"
            className="bg-pink-200 text-slate-800 px-6 py-3.5 rounded-xl hover:bg-amber-300 cursor-pointer shadow-sm transition-all flex-1 max-w-[160px]">
            Yes, Leave
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ConfirmModal;