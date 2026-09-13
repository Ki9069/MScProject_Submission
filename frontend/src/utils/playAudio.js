// Play Cantonese pronunciation using browser Web Speech API
export const playAudio = (character) => {
    
    if (!("speechSynthesis" in window)) {
        console.warn("Speech synthesis is not supported in this browser.");
        return;
    }
    window.speechSynthesis.cancel();

    const utterThis = new SpeechSynthesisUtterance(character);
    utterThis.lang = "zh-HK";
    utterThis.rate = 0.9;

    window.speechSynthesis.speak(utterThis);
    }   