    const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://msccantonese-backend.onrender.com";
    const basePath = `${API_BASE}/api`; 

// Request and stream AI-generated story from backend   
export const generateAIStory = async (aiStoryData, onChunk) => {

    const response = await fetch(
        basePath + "/ai-storytelling",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(aiStoryData)
        }
    );

    if (!response.ok) {
        throw new Error(`error. status: ${response.status}`);}

    if (!response.body) {
        throw new Error("Response body is not available.");}

    // Prepare streamed response for text decoding
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let story = "";

    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            break;
        }

        const chunk = decoder.decode(value, {stream: true });
        story += chunk;
        onChunk(story);
    }

    story += decoder.decode();
    onChunk(story);
    return story;
};