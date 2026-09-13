    const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://msccantonese-backend.onrender.com";
    const basePath = `${API_BASE}/api`;

// Send word-pair learning progress to backend
export const trackWordPairsProgress = async (wpProgressData) =>{
        await fetch(basePath+"/track/wordpairs",{
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify(wpProgressData),
        });
    };

// Send station-level progress to backend
export const trackStationProgress = async (stProgressData) => {
        await fetch(basePath+"/track/stations",{
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify(stProgressData),
        });
    };