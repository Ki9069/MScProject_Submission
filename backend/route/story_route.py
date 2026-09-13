from flask import Blueprint, jsonify, request, Response
from datetime import datetime
from repository.story_log_repository import log_story
from service.story_service import generate_story
from service.tts_service import generate_audio_chunks

story_bp = Blueprint("story", __name__)

#Endpoint to generate an AI story
@story_bp.route("/api/ai-storytelling", methods = ["POST"])
def get_ai_story():
    try:
        data = request.get_json()

        #extract user information for story prompt
        user_name = data.get("name")
        user_age = data.get("age")
        user_interest = data.get("interest")
        word_pair = data.get("wordPair")

        user_id = data.get("userID")
        wordpair_id = data.get("wordPairID")
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        #log story 
        if user_id and wordpair_id:
            try:
                log_story(user_id, wordpair_id, current_time)

            except Exception as log_err:
                    print(f"Failed to log story: {log_err}")

        #stream story text response
        return Response(generate_story(user_name,user_age,user_interest,word_pair), mimetype="text/plain")

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
#Endpoint to generate audio from AI-generated story
@story_bp.route("/api/story-audio", methods=["GET"])
def story_TTS():
    try:
        story_text = request.args.get("text", "")

        if not story_text:
            return jsonify({"error": "No text provided."}), 400

        return Response(
            generate_audio_chunks(story_text),
            mimetype="audio/mpeg"
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500

