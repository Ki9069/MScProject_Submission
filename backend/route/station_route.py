from flask import Blueprint, jsonify
from repository.station_repository import get_stations
from service.station_service import get_station_wordpairs_data

station_bp = Blueprint("station", __name__)

#Endpoint to retrieve all stations
@station_bp.route("/api/stations",methods=["GET"])
def get_stations_route():
    try:
        stations = get_stations()
        return jsonify({"stations": stations}),200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


#Endpoint to retrieve all wordpairs for a specific station
@station_bp.route("/api/stations/<int:station_id>/wordpairs",methods=["GET"])
def get_station_wordpairs_route(station_id):
    try:
        wordpairs = get_station_wordpairs_data(station_id)
        return jsonify({"wordpairs": wordpairs}),200

    except Exception as e:
        return jsonify({"error":"Server error occurred"}),500