from flask import Flask, jsonify, request, send_file, Response
from flask_cors import CORS

from pathlib import Path
from route.user_route import user_bp
from route.station_route import station_bp
from route.progress_route import progress_bp
from route.story_route import story_bp

app = Flask (__name__)
CORS(app) #, resources={r"/api/*": {"origins": "*"}} #, origins=["http://localhost:5173"]

app.register_blueprint(user_bp)
app.register_blueprint(station_bp)
app.register_blueprint(progress_bp)
app.register_blueprint(story_bp)


if __name__ == "__main__":
    app.run(debug=True, port=5001)
    