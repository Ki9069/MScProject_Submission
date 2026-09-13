from flask import Blueprint, jsonify, request
from repository.user_repository import create_user
import sqlite3

user_bp = Blueprint("user", __name__)

# Endpoint to register a new user
@user_bp.route("/api/users", methods=["POST"])
def reg_user():
    user_data = request.get_json() or {}

    name = user_data.get("name")
    age = user_data.get("age")
    interest = user_data.get("interest")
    user_group = user_data.get("userGroup")

    # validate user input
    if not name or not isinstance (name, str) or not name.strip():
        return jsonify({"error":"'name' is required and cannot be empty"}),400

    if age is None or not isinstance(age,int) or age <= 0:
        return jsonify({"error":"'age' is required and must be greater than 0"}),400

    if user_group not in ["A_baseline", "B_advanced"]:
        return jsonify({"error":"'userGroup' must be 'A_baseline' or 'B_advanced'"}), 400
    
    try:
        user_id = create_user(user_group, name, age, interest)
    
        return jsonify(
                { "message": "User registered",
                    "user":{ "userID" : user_id,
                        "userGroup" : user_group,
                        "name" : name,
                        "age" : age,
                        "interest" : interest,}}), 201

    except sqlite3.DatabaseError:
        return jsonify({ "error": "Failed to save user record to db"}), 500

    except Exception:
        return jsonify({"error":"Server error occurred"}),500
