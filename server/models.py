from datetime import datetime

from extensions import db, bcrypt


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    saved_books = db.relationship(
        "SavedBook",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    mood_checkins = db.relationship(
    "MoodCheckIn",
    back_populates="user",
    cascade="all, delete-orphan"
)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "created_at": self.created_at.isoformat(),
        }


class Book(db.Model):
    __tablename__ = "books"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=True)
    cover_url = db.Column(db.Text, nullable=True)
    open_library_id = db.Column(
        db.String(255),
        unique=True,
        nullable=False,
        index=True
    )
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    saved_books = db.relationship(
        "SavedBook",
        back_populates="book",
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "cover_url": self.cover_url,
            "open_library_id": self.open_library_id,
        }


class SavedBook(db.Model):
    __tablename__ = "saved_books"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    book_id = db.Column(
        db.Integer,
        db.ForeignKey("books.id"),
        nullable=False
    )

    mood = db.Column(db.String(100), nullable=True)
    comfort_level = db.Column(db.String(50), nullable=True)
    status = db.Column(
        db.String(50),
        nullable=False,
        default="Want to Read"
    )

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    user = db.relationship("User", back_populates="saved_books")
    book = db.relationship("Book", back_populates="saved_books")

    mood_checkins = db.relationship(
        "MoodCheckIn",
        back_populates="saved_book",
        cascade="all, delete-orphan"
    )

    __table_args__ = (
        db.UniqueConstraint(
            "user_id",
            "book_id",
            name="unique_user_book"
        ),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "book_id": self.book_id,
            "mood": self.mood,
            "comfort_level": self.comfort_level,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "book": self.book.to_dict(),
        }

class MoodCheckIn(db.Model):
    __tablename__ = "mood_checkins"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    saved_book_id = db.Column(
        db.Integer,
        db.ForeignKey("saved_books.id"),
        nullable=False
    )

    intended_mood = db.Column(db.String(100), nullable=True)
    actual_mood = db.Column(db.String(100), nullable=False)
    reflection = db.Column(db.Text, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    user = db.relationship("User", back_populates="mood_checkins")
    saved_book = db.relationship("SavedBook", back_populates="mood_checkins")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "saved_book_id": self.saved_book_id,
            "intended_mood": self.intended_mood,
            "actual_mood": self.actual_mood,
            "reflection": self.reflection,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }