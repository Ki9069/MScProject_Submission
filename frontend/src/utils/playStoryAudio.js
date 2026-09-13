const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://msccantonese-backend.onrender.com";
const basePath = `${API_BASE}/api`;

// Request and play TTS audio for generated story
export const playStoryAudio = (storyText) => {
    if (!storyText) return null;

    const audio = new Audio( `${basePath}/story-audio?text=${encodeURIComponent(storyText)}`);

    audio.addEventListener("error", (event) => {
        console.error("[AUDIO] error:", event); });

    audio.play();
    return audio;
};