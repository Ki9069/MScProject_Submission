from flask import Blueprint, jsonify, request
from repository.progress_repository import track_station_progress,track_wordpairs_progress

progress_bp = Blueprint("progress", __name__)

# Endpoint for tracking station progress
@progress_bp.route("/api/track/stations",methods=["POST"])
def track_station_event(): 
    data = request.get_json()

    try:
        track_station_progress(data)
        return jsonify({"message": "Challenge progress tracked!"}),200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500



# Endpoint for tracking wordpair progress
@progress_bp.route("/api/track/wordpairs",methods=["POST"])
def track_wordpair_Event(): 
    data = request.get_json()

    try:
        track_wordpairs_progress(data)
        return jsonify({"message": "Challenge progress tracked!"}), 200 
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        