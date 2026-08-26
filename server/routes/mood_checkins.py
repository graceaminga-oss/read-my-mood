from flask import Blueprint, jsonify, request, session

from extensions import db
from models import MoodCheckIn, SavedBook
from auth_helpers import login_required


mood_checkins_bp = Blueprint(
    "mood_checkins",
    __name__,
    url_prefix="/api/mood-checkins"
)


@mood_checkins_bp.post("")
@login_required
def create_mood_checkin():
    user_id = session["user_id"]

    data = request.get_json() or {}

    saved_book_id = data.get("saved_book_id")
    intended_mood = data.get("intended_mood")
    actual_mood = data.get("actual_mood")
    reflection = data.get("reflection")

    if not saved_book_id or not actual_mood:
        return jsonify({
            "error": "saved_book_id and actual_mood are required."
        }), 400

    saved_book = SavedBook.query.filter_by(
        id=saved_book_id,
        user_id=user_id
    ).first()

    if not saved_book:
        return jsonify({
            "error": "Saved book not found."
        }), 404

    mood_checkin = MoodCheckIn(
        user_id=user_id,
        saved_book_id=saved_book_id,
        intended_mood=intended_mood,
        actual_mood=actual_mood,
        reflection=reflection
    )

    db.session.add(mood_checkin)
    db.session.commit()

    return jsonify({
        "message": "Mood check-in created successfully.",
        "mood_checkin": mood_checkin.to_dict()
    }), 201


@mood_checkins_bp.get("")
@login_required
def get_mood_checkins():
    user_id = session["user_id"]

    try:
        page = max(request.args.get("page", 1, type=int), 1)
        per_page = max(
            min(request.args.get("per_page", 10, type=int), 50),
            1
        )
    except (TypeError, ValueError):
        page = 1
        per_page = 10

    pagination = (
        MoodCheckIn.query
        .filter_by(user_id=user_id)
        .order_by(MoodCheckIn.created_at.desc())
        .paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
    )

    return jsonify({
        "mood_checkins": [
            mood_checkin.to_dict()
            for mood_checkin in pagination.items
        ],
        "page": pagination.page,
        "per_page": pagination.per_page,
        "total": pagination.total,
        "total_pages": pagination.pages
    }), 200


@mood_checkins_bp.get("/<int:mood_checkin_id>")
@login_required
def get_mood_checkin(mood_checkin_id):
    user_id = session["user_id"]

    mood_checkin = MoodCheckIn.query.filter_by(
        id=mood_checkin_id,
        user_id=user_id
    ).first()

    if not mood_checkin:
        return jsonify({
            "error": "Mood check-in not found."
        }), 404

    return jsonify({
        "mood_checkin": mood_checkin.to_dict()
    }), 200


@mood_checkins_bp.patch("/<int:mood_checkin_id>")
@login_required
def update_mood_checkin(mood_checkin_id):
    user_id = session["user_id"]

    mood_checkin = MoodCheckIn.query.filter_by(
        id=mood_checkin_id,
        user_id=user_id
    ).first()

    if not mood_checkin:
        return jsonify({
            "error": "Mood check-in not found."
        }), 404

    data = request.get_json() or {}

    if "intended_mood" in data:
        mood_checkin.intended_mood = data["intended_mood"]

    if "actual_mood" in data:
        if not data["actual_mood"]:
            return jsonify({
                "error": "actual_mood cannot be empty."
            }), 400

        mood_checkin.actual_mood = data["actual_mood"]

    if "reflection" in data:
        mood_checkin.reflection = data["reflection"]

    db.session.commit()

    return jsonify({
        "message": "Mood check-in updated successfully.",
        "mood_checkin": mood_checkin.to_dict()
    }), 200


@mood_checkins_bp.delete("/<int:mood_checkin_id>")
@login_required
def delete_mood_checkin(mood_checkin_id):
    user_id = session["user_id"]

    mood_checkin = MoodCheckIn.query.filter_by(
        id=mood_checkin_id,
        user_id=user_id
    ).first()

    if not mood_checkin:
        return jsonify({
            "error": "Mood check-in not found."
        }), 404

    db.session.delete(mood_checkin)
    db.session.commit()

    return jsonify({
        "message": "Mood check-in deleted successfully."
    }), 200
