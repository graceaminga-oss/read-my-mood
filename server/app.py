import os

from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from extensions import db, bcrypt
from models import User, Book, SavedBook
from routes.auth import auth_bp
from routes.saved_books import saved_books_bp
from routes.mood_checkins import mood_checkins_bp


def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    db.init_app(app)
    bcrypt.init_app(app)

    frontend_url = os.getenv(
        "FRONTEND_URL",
        "http://localhost:5173"
    )

    CORS(
        app,
        origins=[frontend_url],
        supports_credentials=True
    )

    app.register_blueprint(saved_books_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(mood_checkins_bp)

    with app.app_context():
        db.create_all()

    @app.route("/")
    def home():
        return jsonify({
            "message": "Read My Mood API is running"
        })

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=True, port=5000)