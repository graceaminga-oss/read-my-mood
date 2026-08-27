# Read My Mood

Read My Mood is a full-stack web app that helps users find books based on their mood and how much reading comfort they're looking for. Users can create an account, save books to their own shelf, and write mood check-ins about how their reading is going.

## What It Does

* Users can sign up, log in, and log out (with sessions to keep them logged in)
* Recommends books based on mood, using the Open Library API
* Users can save books to a personal shelf
* Users can track the reading status of each saved book
* Users can write mood check-ins and reflections
* Full CRUD (Create, Read, Update, Delete) for Saved Books
* Full CRUD for Mood Check-Ins
* Users can only see and manage their own data
* Saved books and mood check-ins are paginated (shown in pages, not all at once)
* Works well on different screen sizes (responsive design)

## Built With

**Frontend**
* React
* JavaScript
* Vite
* Tailwind CSS

**Backend**
* Python
* Flask
* Flask-SQLAlchemy
* Flask-Bcrypt (for password hashing)

**Database**
* PostgreSQL

**External API**
* Open Library API

## Project Structure

This app is split into two parts: a `src` folder for the React frontend, and a `server` folder for the Flask backend.

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

## API Routes

### Saved Books

| Method | Endpoint                | What it does           |
| ------ | ------------------------ | ----------------------- |
| POST   | `/api/saved-books`      | Save a new book         |
| GET    | `/api/saved-books`      | Get all saved books     |
| GET    | `/api/saved-books/<id>` | Get one saved book      |
| PATCH  | `/api/saved-books/<id>` | Update a saved book     |
| DELETE | `/api/saved-books/<id>` | Delete a saved book     |

### Mood Check-Ins

| Method | Endpoint                   | What it does              |
| ------ | ---------------------------- | --------------------------- |
| POST   | `/api/mood-checkins`      | Create a mood check-in      |
| GET    | `/api/mood-checkins`      | Get all mood check-ins      |
| GET    | `/api/mood-checkins/<id>` | Get one mood check-in       |
| PATCH  | `/api/mood-checkins/<id>` | Update a mood check-in      |
| DELETE | `/api/mood-checkins/<id>` | Delete a mood check-in      |

You have to be logged in to use any of these routes, and you can only access or change your own data.

## How to Run This Project Locally

This app has two separate parts that both need to be running at the same time: the **backend** (Flask) and the **frontend** (React). Each one has its own folder, its own dependencies, and its own `.env` file for settings.

### 1. Backend Setup

Open a terminal and go into the `server` folder, then create a virtual environment:

```bash
cd server
python -m venv venv
```

A virtual environment is just a private space for this project's Python packages, so they don't mix with other projects on your computer.

Now activate it:

**Windows:**
```powershell
.\venv\Scripts\Activate.ps1
```

You'll know it worked if you see `(venv)` appear at the start of your terminal line.

Install the required packages and start the server:

```bash
pip install -r requirements.txt
python app.py
```

The backend will run at `http://localhost:5000`.

Now create a `.env` file inside the `server` folder. This file holds private settings that shouldn't be shared or uploaded to GitHub:

```env
DATABASE_URL=your_postgresql_database_url
SECRET_KEY=your_secret_key
FRONTEND_URL=http://localhost:5173
```

For `DATABASE_URL`, you need a working PostgreSQL database. You can either:
* Install Postgres on my computer and run `createdb read_my_mood`
* Create a free Postgres database on Render

### 2. Frontend Setup

Open a **new** terminal (keep the backend one running) and go back to the project's root folder:

```bash
npm install
```

Create a `.env` file in the root folder, next to `package.json`:

```env
VITE_API_URL=http://localhost:5000/api
```

Then start the frontend:

```bash
npm run dev
```

The frontend will run at `http://localhost:5173`. Make sure the backend is already running before you open this, or requests won't work.

> **Note:** The frontend doesn't have the API URL typed directly into the code. Instead, it reads it from `VITE_API_URL` in the `.env` file. That way, the same code works locally and after deployment — only the `.env` value changes, nothing in the code itself.

Don't upload the `.env` file or `venv` folder to GitHub. They contain private info and personal setup files that don't need to be shared.

## How the App Flows

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

## Live App

You can try the deployed version here: <https://read-my-mood-1.onrender.com>

Note: since this is hosted on a free Render plan, the app may take 30–60 seconds to load the first time if it's been inactive — this is normal, not a bug.