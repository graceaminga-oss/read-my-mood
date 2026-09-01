# Read My Mood

## Project Description

**Read My Mood** is a full-stack web application that helps readers find books based on their mood and how much reading comfort they are looking for.

The idea behind the project is simple: sometimes you know how you feel, but you don't know what you want to read. Read My Mood lets users choose a mood and comfort level, discover book recommendations, save books they are interested in, track their reading progress, and record how the books actually made them feel.

The application also includes a personal mood journal where users can create, view, edit, and delete reading reflections.

This project was built as my **Project 3 Full-Stack Application with Authentication** capstone.

---

## Live Application

**Live App:**
https://read-my-mood-1.onrender.com

> The application is deployed on Render's free tier. If the application has been inactive for a while, the first load may take 30–60 seconds while the server starts up.

---

## What the App Does

Users can:

* Create an account
* Log in and log out
* Stay authenticated using Flask sessions
* Choose a mood
* Choose a reading comfort level
* Discover books using the Open Library API
* Save books to their personal shelf
* View their saved books
* Track the reading status of saved books
* Update saved books
* Delete saved books
* Create mood check-ins
* Record their intended mood before reading
* Record their actual mood after reading
* Write reflections about their reading experience
* Edit mood check-ins
* Delete mood check-ins
* View their saved books and mood check-ins using pagination
* Use the application on mobile, tablet, and desktop screens

---

## Authentication

Read My Mood uses **Flask session-based authentication**.

When a user logs in successfully, the application stores the user's ID in the Flask session:

```text
session["user_id"] = user.id
```

The session is then used to identify the currently logged-in user when accessing protected resources.

### Authentication Flow

```text
Create Account
      ↓
Log In
      ↓
Flask Creates Session
      ↓
User Accesses Personal Resources
      ↓
Check Session for User ID
      ↓
Allow Access to User's Own Data
      ↓
Log Out
      ↓
Session Cleared
```

Passwords are not stored as plain text. Passwords are hashed using **Flask-Bcrypt** before being stored in the database.

The application also provides a `/api/me` route that allows the frontend to check whether a user currently has a valid session.

---

## Authorization & User Data

Authentication answers the question:

> "Is this person logged in?"

Authorization answers the question:

> "Is this person allowed to access this particular resource?"

Read My Mood uses both.

Saved books and mood check-ins belong to the user who created them. Protected backend routes verify the authenticated user before allowing access, updates, or deletion.

This means users cannot access or modify another user's saved books or mood check-ins by simply changing a resource ID in a request.

For example, if User A owns saved book `#5`, User B should not be able to access or modify that book just by requesting `/api/saved-books/5`.

This user ownership is enforced by the backend rather than relying only on the frontend.

---

## Main Features

### 1. User Authentication

Users can:

* Sign up
* Log in
* Log out
* Check their current authentication state

The backend validates account information and creates a secure session after a successful login.

---

### 2. Mood-Based Book Discovery

Users begin by choosing how they feel and how comfortable they want their reading experience to be.

The application then uses the **Open Library API** to find book recommendations.

This gives users a more personal way to discover books instead of simply browsing a general book list.

---

### 3. Personal Reading Shelf

Users can save books that they are interested in.

Each user's shelf is personal to their account.

Users can:

* Add books
* View saved books
* Update reading status
* View individual saved books
* Delete books
* Navigate through paginated results

---

### 4. Mood Check-Ins

The mood check-in feature acts as a small reading journal.

After reading, users can record:

* The book they were reading
* Their intended mood
* Their actual mood
* A personal reflection

Users can also edit or delete previous check-ins.

This makes it possible to look back at how different books affected their mood.

---

### 6. Responsive Design

The React frontend is designed to work across different screen sizes.

The interface adapts to:

* Mobile phones
* Tablets
* Laptops
* Desktop computers

Tailwind CSS responsive utilities are used throughout the frontend.

---

# Full CRUD

The application implements complete CRUD functionality for two user-owned resources.

CRUD stands for:

* **Create**
* **Read**
* **Update**
* **Delete**

## Saved Books CRUD

| Operation | Method | Endpoint                | Description         |
| --------- | ------ | ----------------------- | ------------------- |
| Create    | POST   | `/api/saved-books`      | Save a new book     |
| Read      | GET    | `/api/saved-books`      | Get all saved books |
| Read      | GET    | `/api/saved-books/<id>` | Get one saved book  |
| Update    | PATCH  | `/api/saved-books/<id>` | Update a saved book |
| Delete    | DELETE | `/api/saved-books/<id>` | Delete a saved book |

## Mood Check-Ins CRUD

| Operation | Method | Endpoint                  | Description            |
| --------- | ------ | ------------------------- | ---------------------- |
| Create    | POST   | `/api/mood-checkins`      | Create a mood check-in |
| Read      | GET    | `/api/mood-checkins`      | Get all mood check-ins |
| Read      | GET    | `/api/mood-checkins/<id>` | Get one mood check-in  |
| Update    | PATCH  | `/api/mood-checkins/<id>` | Update a mood check-in |
| Delete    | DELETE | `/api/mood-checkins/<id>` | Delete a mood check-in |

All user-owned resources are protected by authentication and authorization.

---

# API Routes

## Authentication Routes

| Method | Endpoint      | What it does                          |
| ------ | ------------- | ------------------------------------- |
| POST   | `/api/signup` | Creates a new user account            |
| POST   | `/api/login`  | Logs in a user and creates a session  |
| POST   | `/api/logout` | Logs out the current user             |
| GET    | `/api/me`     | Gets the currently authenticated user |

### Signup

A user provides:

* Name
* Email
* Password

The backend validates the information, checks whether the email is already registered, hashes the password, and creates the user.

Passwords must be at least 8 characters long.

### Login

The user provides their email and password.

The backend verifies the credentials and creates a Flask session containing the user's ID.

### Logout

The user's session is cleared when they log out.

### Current User

The `/api/me` endpoint checks the current session and returns the authenticated user's information.

---

# API Access Control

Protected resources require an authenticated session.

The backend uses the logged-in user's ID to determine which records belong to them.

The general flow is:

```text
Request
   ↓
Check Session
   ↓
Is User Logged In?
   ↓
Yes
   ↓
Find Resource
   ↓
Does Resource Belong to User?
   ↓
Yes → Allow Request
No  → Reject Request
```

This protects user-owned data at the backend level.

---

# Tech Stack

## Frontend

* **React** — used to build the interactive user interface
* **JavaScript** — application logic
* **Vite** — frontend development and production build tool
* **Tailwind CSS** — styling and responsive layouts

## Backend

* **Python** — backend programming language
* **Flask** — REST API framework
* **Flask-SQLAlchemy** — database integration and ORM
* **Flask-Bcrypt** — password hashing
* **Flask Sessions** — authentication and session management

## Database

* **PostgreSQL**

PostgreSQL stores user accounts, saved books, reading status, and mood check-ins.

## External API

* **Open Library API**

Open Library provides the book information used for book discovery and recommendations.

## Deployment

* **Render**

---

# Project Structure

The application is separated into a React frontend and a Flask backend.

```text
Read-My-Mood/
│
├── src/
│   ├── api/
│   │   ├── backend.js
│   │   └── openLibrary.js
│   │
│   ├── components/
│   │   ├── AuthForm.jsx
│   │   ├── BookShelf.jsx
│   │   ├── ComfortMeter.jsx
│   │   ├── MoodCheckInForm.jsx
│   │   ├── MoodCheckIns.jsx
│   │   ├── MoodPicker.jsx
│   │   ├── MyShelf.jsx
│   │   └── Navbar.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── server/
│   ├── routes/
│   │   ├── auth.py
│   │   ├── saved_books.py
│   │   └── mood_checkins.py
│   │
│   ├── app.py
│   ├── models.py
│   ├── extensions.py
│   ├── config.py
│   └── auth_helpers.py
│
├── package.json
├── requirements.txt
├── .gitignore
└── README.md
```

---

# How the App Works

The main user flow is:

```text
Sign Up
   ↓
Log In
   ↓
Authenticated Session
   ↓
Choose Mood
   ↓
Choose Comfort Level
   ↓
Find Books
   ↓
View Recommendations
   ↓
Save a Book
   ↓
Personal Reading Shelf
   ↓
Track Reading Status
   ↓
Create Mood Check-In
   ↓
Edit / Delete Reflection
```

---

# How to Run the Project Locally

The project has two parts that need to run during development:

1. Flask backend
2. React frontend

You will need to run both at the same time.

## Prerequisites

Before starting, make sure you have installed:

* Python 3
* Node.js
* npm
* PostgreSQL
* Git

---

# 2. Backend Setup

Move into the server folder:

```bash
cd server
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Once activated, you should see `(venv)` at the beginning of your terminal prompt.

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

---

## Backend Environment Variables

Create a `.env` file inside the `server` folder.

```env
DATABASE_URL=your_postgresql_database_url
SECRET_KEY=your_secret_key
FRONTEND_URL=http://localhost:5173
```

### What these variables are for

**DATABASE_URL**

The connection URL for the PostgreSQL database.

**SECRET_KEY**

Used by Flask to securely sign session data.

**FRONTEND_URL**

The URL of the React frontend during local development.

---

## Start the Backend

From the `server` directory:

```bash
python app.py
```

The backend should run at:

```text
http://localhost:5000
```

Keep this terminal running.

---

# 3. Frontend Setup

Open a **new terminal**.

Return to the project root:

```bash
cd ..
```

Install the frontend dependencies:

```bash
npm install
```

Create a `.env` file in the project root, next to `package.json`:

```env
VITE_API_URL=http://localhost:5000/api
```

This tells the React application where the Flask API is located.

Start the React development server:

```bash
npm run dev
```

The frontend should run at:

```text
http://localhost:5173
```

---

# Environment Variables

Environment variables are used so that private information and environment-specific settings are not hardcoded into the application.

## Backend

Located in:

```text
server/.env
```

Example:

```env
DATABASE_URL=your_postgresql_database_url
SECRET_KEY=your_secret_key
FRONTEND_URL=http://localhost:5173
```

## Frontend

Located in:

```text
.env
```

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

**Do not commit `.env` files to GitHub.**

The `.gitignore` file should keep private environment files and the Python virtual environment out of version control.

---

# Production Build

Before deployment, the React application can be built using Vite.

From the project root:

```bash
npm run build
```

This creates a production-ready `dist` folder.

A successful build should look similar to:

```text
vite building client environment for production...
✓ modules transformed.
✓ built in ...
```

The generated `dist` folder contains the optimized frontend assets for production.

---

# Database

Read My Mood uses PostgreSQL to store persistent application data.

The main data includes:

* Users
* Saved books
* Reading status
* Mood check-ins
* Reflections

The database relationships connect user-owned resources to the user who created them.

This allows the backend to enforce data ownership and prevent users from accessing another user's personal information.

---

# External API

Read My Mood uses the **Open Library API** for book discovery.

The application uses book information returned from Open Library to display recommendations based on the user's selected mood and reading preferences.

The external API allows the application to provide a larger selection of books without maintaining a separate book catalog.

---

# Security

The application includes:

* Password hashing using Flask-Bcrypt
* Flask session-based authentication
* Protected backend routes
* User ownership checks
* Authorization before modifying or deleting resources
* Environment variables for secrets and database credentials
* `.env` files excluded from Git
* Validation for required authentication fields
* Password length validation
* Duplicate email checking during signup

---

# Responsive User Interface

The frontend was designed to work across different screen sizes.

Responsive layouts are implemented using Tailwind CSS.

The application adapts:

* Navigation
* Forms
* Book cards
* Reading shelf layouts
* Mood check-in forms
* Buttons
* Spacing
* Typography

This allows the application to remain usable on both mobile and desktop devices.

---

# Design Goals

The design of Read My Mood was created to feel calm and comfortable because the application is centered around reading and personal reflection.

The interface uses:

* Warm neutral colors
* Dark green accents
* Serif typography for headings
* Simple layouts
* Clear form controls
* Responsive spacing
* Minimal visual clutter

The goal is to make the application feel more like a personal reading space than a generic book-search application.

---

# Challenges & What I Learned

Building Read My Mood helped me practice several parts of full-stack development.

Some of the main areas I worked with were:

### Authentication

I learned how to create user registration and login flows and how Flask sessions can be used to keep track of authenticated users.

### Authorization

I learned that authentication alone is not enough. The backend also needs to check whether a resource actually belongs to the logged-in user before allowing changes or deletion.

### CRUD Operations

I implemented complete Create, Read, Update, and Delete functionality for both saved books and mood check-ins.

### Frontend and Backend Integration

I connected React components to Flask API routes and handled loading states, errors, form submissions, updates, and deletions.

### Database Relationships

I used PostgreSQL and SQLAlchemy to associate user-owned resources with their respective users.

### External API Integration

I used the Open Library API to provide book recommendations and information.

### Deployment

I learned how environment variables, production builds, and deployment settings differ from local development.

---

# Project Goals

The main goals of this project were to demonstrate my ability to build a complete full-stack application that includes:

* User authentication
* User authorization
* User-owned resources
* RESTful API routes
* Complete CRUD functionality
* Database persistence
* Frontend and backend integration
* External API integration
* Responsive design
* Pagination
* Secure environment variable handling
* Production deployment

---

# Future Improvements

If I continued developing Read My Mood, I would consider adding:

* More detailed reading statistics
* Mood trends over time
* Book ratings
* Favorite books
* Reading goals
* More advanced filtering
* Search by author or genre
* Better recommendation personalization
* Reading streaks
* User profile customization
* bookclubs

