# Read My Mood

Read My Mood is a full-stack productivity application that helps users find books based on their mood and reading comfort level. Users can save books to a personal shelf and record mood check-ins about their reading experience.

## Features

* User signup, login, logout, and session authentication
* Mood-based book recommendations using the Open Library API
* Personal saved book shelf
* Reading status tracking
* Mood check-ins and reflections
* Full CRUD for Saved Books
* Full CRUD for Mood Check-Ins
* User ownership and authorization
* Pagination for saved books and mood check-ins
* Responsive React interface

## Technologies

**Frontend**

* React
* JavaScript
* Vite
* Tailwind CSS

**Backend**

* Python
* Flask
* Flask-SQLAlchemy
* Flask-Bcrypt

**Database**

* PostgreSQL

**External API**

* Open Library API

## Project Structure

```text
Read-My-Mood/
├── src/
│   ├── api/
│   ├── components/
│   ├── App.jsx
│   └── main.jsx
│
├── server/
│   ├── routes/
│   │   ├── auth.py
│   │   ├── saved_books.py
│   │   └── mood_checkins.py
│   ├── app.py
│   ├── models.py
│   ├── extensions.py
│   ├── config.py
│   └── auth_helpers.py
│
└── README.md
```

## CRUD Resources

### Saved Books

| Method | Endpoint                |
| ------ | ----------------------- |
| POST   | `/api/saved-books`      |
| GET    | `/api/saved-books`      |
| GET    | `/api/saved-books/<id>` |
| PATCH  | `/api/saved-books/<id>` |
| DELETE | `/api/saved-books/<id>` |

### Mood Check-Ins

| Method | Endpoint                  |
| ------ | ------------------------- |
| POST   | `/api/mood-checkins`      |
| GET    | `/api/mood-checkins`      |
| GET    | `/api/mood-checkins/<id>` |
| PATCH  | `/api/mood-checkins/<id>` |
| DELETE | `/api/mood-checkins/<id>` |

All protected resources require authentication and are restricted to the logged-in user's own records.

## Setup

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd server
python -m venv venv
```

Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
python app.py
```

Create a `.env` file inside `server/`:

```env
DATABASE_URL=your_postgresql_database_url
SECRET_KEY=your_secret_key
```

Do not commit `.env` or `venv/` to GitHub.

## Application Flow

```text
Sign Up / Log In
       ↓
Choose Mood
       ↓
Choose Comfort Level
       ↓
Find Books
       ↓
Save Book
       ↓
Manage Reading Shelf
       ↓
Create Mood Check-In
```

## Project Requirements

* [x] React frontend
* [x] Flask backend
* [x] PostgreSQL database
* [x] Authentication
* [x] Two relational resources
* [x] Full CRUD
* [x] Ownership authorization
* [x] Pagination
* [x] External API integration
* [x] README documentation

## Links

**Live App:** <https://read-my-mood-1.onrender.com
