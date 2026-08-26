from flask import Blueprint, jsonify, request, session

from extensions import db
from models import Book, SavedBook
from auth_helpers import login_required


saved_books_bp = Blueprint(
    "saved_books",
    __name__,
    url_prefix="/api/saved-books"
)


@saved_books_bp.post("")
@login_required
def create_saved_book():
    user_id = session["user_id"]

    data = request.get_json() or {}

    open_library_id = data.get("open_library_id", "").strip()
    title = data.get("title", "").strip()
    author = data.get("author", "").strip()
    cover_url = data.get("cover_url")
    mood = data.get("mood")
    comfort_level = data.get("comfort_level")
    status = data.get("status", "Want to Read")

    if not open_library_id or not title:
        return jsonify({
            "error": "open_library_id and title are required."
        }), 400

    # Check whether this book already exists in our database.
    book = Book.query.filter_by(
        open_library_id=open_library_id
    ).first()

    if not book:
        book = Book(
            title=title,
            author=author or None,
            cover_url=cover_url,
            open_library_id=open_library_id
        )

        db.session.add(book)
        db.session.flush()

    # Prevent the same user from saving the same book twice.
    existing_saved_book = SavedBook.query.filter_by(
        user_id=user_id,
        book_id=book.id
    ).first()

    if existing_saved_book:
        return jsonify({
            "error": "You have already saved this book."
        }), 409

    saved_book = SavedBook(
        user_id=user_id,
        book_id=book.id,
        mood=mood,
        comfort_level=comfort_level,
        status=status
    )

    db.session.add(saved_book)
    db.session.commit()

    return jsonify({
        "message": "Book saved successfully.",
        "saved_book": saved_book.to_dict()
    }), 201


@saved_books_bp.get("")
@login_required
def get_saved_books():
    user_id = session["user_id"]

    # Pagination settings.
    # page must be at least 1.
    # per_page is limited to a maximum of 50.
    page = max(
        request.args.get("page", 1, type=int),
        1
    )

    per_page = max(
        min(
            request.args.get("per_page", 10, type=int),
            50
        ),
        1
    )

    pagination = (
        SavedBook.query
        .filter_by(user_id=user_id)
        .order_by(SavedBook.created_at.desc())
        .paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
    )

    return jsonify({
        "saved_books": [
            saved_book.to_dict()
            for saved_book in pagination.items
        ],
        "page": pagination.page,
        "per_page": pagination.per_page,
        "total": pagination.total,
        "total_pages": pagination.pages,
    }), 200


@saved_books_bp.get("/<int:saved_book_id>")
@login_required
def get_saved_book(saved_book_id):
    user_id = session["user_id"]

    saved_book = SavedBook.query.filter_by(
        id=saved_book_id,
        user_id=user_id
    ).first()

    if not saved_book:
        return jsonify({
            "error": "Saved book not found."
        }), 404

    return jsonify({
        "saved_book": saved_book.to_dict()
    }), 200


@saved_books_bp.patch("/<int:saved_book_id>")
@login_required
def update_saved_book(saved_book_id):
    user_id = session["user_id"]

    # Only allow the owner to update the saved book.
    saved_book = SavedBook.query.filter_by(
        id=saved_book_id,
        user_id=user_id
    ).first()

    if not saved_book:
        return jsonify({
            "error": "Saved book not found."
        }), 404

    data = request.get_json() or {}

    if "mood" in data:
        saved_book.mood = data["mood"]

    if "comfort_level" in data:
        saved_book.comfort_level = data["comfort_level"]

    if "status" in data:
        status = data["status"]

        if not status:
            return jsonify({
                "error": "status cannot be empty."
            }), 400

        saved_book.status = status

    db.session.commit()

    return jsonify({
        "message": "Saved book updated successfully.",
        "saved_book": saved_book.to_dict()
    }), 200


@saved_books_bp.delete("/<int:saved_book_id>")
@login_required
def delete_saved_book(saved_book_id):
    user_id = session["user_id"]

    # Only allow the owner to delete the saved book.
    saved_book = SavedBook.query.filter_by(
        id=saved_book_id,
        user_id=user_id
    ).first()

    if not saved_book:
        return jsonify({
            "error": "Saved book not found."
        }), 404

    db.session.delete(saved_book)
    db.session.commit()

    return jsonify({
        "message": "Saved book deleted successfully."
    }), 200