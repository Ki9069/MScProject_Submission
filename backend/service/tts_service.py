from openai import OpenAI
import os
from dotenv import load_dotenv 

load_dotenv()

openai_key = os.environ.get("OPENAI_API_KEY")
if not openai_key:
    raise RuntimeError("OPENAI_API_KEY is not configured")
openai_client = OpenAI(api_key= openai_key)

# Generate and stream audio from story text with OpenAI
def generate_audio_chunks(story_text):

    with openai_client.audio.speech.with_streaming_response.create(
        model="gpt-4o-mini-tts",
        voice="ballad",
        input=story_text,
        instructions=(
            "Speak as a warm, friendly storyteller reading to a young child. "
            "Use clear British English pronunciation. "
            "Be aware of the Cantonese Jyutping within the story and pronounce it carefully."
        )
    ) as tts_response:

        for chunk in tts_response.iter_bytes(chunk_size=1024):
            yield chunk
         