from flask import Blueprint, jsonify, request, session

from extensions import db
from models import User


auth_bp = Blueprint("auth", __name__, url_prefix="/api")


@auth_bp.post("/signup")
def signup():
    data = request.get_json() or {}

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not name or not email or not password:
        return jsonify({
            "error": "Name, email, and password are required."
        }), 400

    if len(password) < 8:
        return jsonify({
            "error": "Password must be at least 8 characters."
        }), 400

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({
            "error": "An account with that email already exists."
        }), 409

    user = User(
        name=name,
        email=email
    )

    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "Account created successfully.",
        "user": user.to_dict()
    }), 201


@auth_bp.post("/login")
def login():
    data = request.get_json() or {}

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({
            "error": "Email and password are required."
        }), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({
            "error": "Invalid email or password."
        }), 401

    session.clear()
    session["user_id"] = user.id

    return jsonify({
        "message": "Login successful.",
        "user": user.to_dict()
    }), 200


@auth_bp.post("/logout")
def logout():
    session.clear()

    return jsonify({
        "message": "Logged out successfully."
    }), 200


@auth_bp.get("/me")
def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({
            "error": "Not authenticated."
        }), 401

    user = db.session.get(User, user_id)

    if not user:
        session.clear()

        return jsonify({
            "error": "User no longer exists."
        }), 401

    return jsonify({
        "user": user.to_dict()
    }), 200