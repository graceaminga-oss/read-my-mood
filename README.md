# Read My Mood

A full-stack productivity application that helps users discover books based on their current mood and reading comfort level, save books to a personal shelf, and track their reading experience through mood check-ins.

Read My Mood combines a React frontend with a Flask REST API and PostgreSQL database. Users can create an account, log in securely, receive personalized book recommendations, save books, update their reading status, and record reflections about how a book made them feel.

---

## 1. Project Overview

Read My Mood is designed around a simple idea:

> The right book depends not only on what you like, but also on how you feel right now.

Users select:

* **Mood** — Cozy, Adventurous, Heartbroken, or Curious
* **Reading Comfort Level** — a scale from 1 to 5

The application uses the selected mood to search the Open Library API and display book recommendations.

Authenticated users can then save books to their personal shelf and manage their saved reading information.

Users can also create mood check-ins connected to their saved books. A check-in records the mood they intended to have, their actual mood, and an optional reflection.

---

## 2. Project Goals

This project demonstrates full-stack development using:

* React
* Flask
* PostgreSQL
* SQLAlchemy
* Flask-Bcrypt
* Session-based authentication
* RESTful API routes
* CRUD operations
* Relational database models
* User ownership and authorization
* Pagination
* External API integration
* Responsive frontend design

---

## 3. Core Features

### Authentication

Users can:

* Sign up
* Log in
* Log out
* Restore an existing session
* Retrieve the currently authenticated user

Passwords are securely hashed before being stored in the database.

Authentication is handled using Flask sessions.

### Mood-Based Book Recommendations

Users can select their current mood and reading comfort level.

The application uses the selected mood to search the Open Library API and return relevant books.

### Personal Book Shelf

Authenticated users can:

* Save books
* View saved books
* View an individual saved book
* Update saved book information
* Delete saved books

Saved book information includes:

* Mood
* Comfort level
* Reading status

Example statuses include:

* Want to Read
* Reading
* Finished

### Mood Check-Ins

Users can create mood check-ins associated with their saved books.

Each check-in can contain:

* Intended mood
* Actual mood
* Reflection
* Associated saved book

Users can:

* Create check-ins
* View check-ins
* View an individual check-in
* Update check-ins
* Delete check-ins

### Pagination

Pagination has been implemented for saved books and mood check-ins.

Example:

```text
/api/saved-books?page=1&per_page=10
```

```text
/api/mood-checkins?page=1&per_page=10
```

The API returns pagination information including:

* Current page
* Items per page
* Total records
* Total pages

---

## 4. User Ownership and Authorization

User data is protected using ownership-based access control.

Authenticated routes use a `login_required` decorator.

For resources belonging to users, the backend verifies both:

```python
id=resource_id
user_id=current_user_id
```

For example:

```python
saved_book = SavedBook.query.filter_by(
    id=saved_book_id,
    user_id=user_id
).first()
```

This prevents one authenticated user from accessing, modifying, or deleting another user's records.

The same ownership principle is applied to mood check-ins.

---

## 5. Database Relationships

The application uses relational database models.

### User

A user can have many saved books and many mood check-ins.

```text
User
 ├── SavedBook
 └── MoodCheckIn
```

### Book

A book represents a book returned by Open Library.

```text
Book
 └── SavedBook
```

### SavedBook

`SavedBook` connects a user with a book.

It stores user-specific information such as:

* Mood
* Comfort level
* Reading status

```text
User ───< SavedBook >─── Book
```

### MoodCheckIn

A mood check-in belongs to a user and is connected to one of their saved books.

```text
User ───< MoodCheckIn
              |
              v
          SavedBook
```

This creates the relational structure required for the project.

---

## 6. CRUD Functionality

### Saved Books

| Operation | Method | Endpoint                |
| --------- | ------ | ----------------------- |
| Create    | POST   | `/api/saved-books`      |
| Read all  | GET    | `/api/saved-books`      |
| Read one  | GET    | `/api/saved-books/<id>` |
| Update    | PATCH  | `/api/saved-books/<id>` |
| Delete    | DELETE | `/api/saved-books/<id>` |

### Mood Check-Ins

| Operation | Method | Endpoint                  |
| --------- | ------ | ------------------------- |
| Create    | POST   | `/api/mood-checkins`      |
| Read all  | GET    | `/api/mood-checkins`      |
| Read one  | GET    | `/api/mood-checkins/<id>` |
| Update    | PATCH  | `/api/mood-checkins/<id>` |
| Delete    | DELETE | `/api/mood-checkins/<id>` |

### Authentication

| Operation    | Method | Endpoint      |
| ------------ | ------ | ------------- |
| Sign up      | POST   | `/api/signup` |
| Log in       | POST   | `/api/login`  |
| Log out      | POST   | `/api/logout` |
| Current user | GET    | `/api/me`     |

---

## 7. Frontend Structure

The React application is organized into reusable components.

```text
src/
├── api/
│   ├── backend.js
│   └── openLibrary.js
│
├── components/
│   ├── AuthForm.jsx
│   ├── BookShelf.jsx
│   ├── ComfortMeter.jsx
│   ├── MoodCheckInForm.jsx
│   ├── MoodCheckIns.jsx
│   ├── MoodPicker.jsx
│   └── MyShelf.jsx
│
├── App.jsx
├── index.css
└── main.jsx
```

### `App.jsx`

The main application component.

It manages:

* Authentication state
* Selected mood
* Comfort level
* Book recommendations
* Saved books
* Mood check-in refresh state
* Loading and error states

### `AuthForm.jsx`

Handles:

* User registration
* User login
* Authentication form state
* Authentication errors

### `MoodPicker.jsx`

Allows users to select their current mood.

### `ComfortMeter.jsx`

Allows users to select their preferred reading comfort level from 1 to 5.

### `BookShelf.jsx`

Displays books returned from Open Library and allows authenticated users to save books.

### `MyShelf.jsx`

Displays the user's saved books and provides controls for managing saved book information.

### `MoodCheckInForm.jsx`

Allows users to create a mood check-in connected to a saved book.

### `MoodCheckIns.jsx`

Displays the user's existing mood check-ins and provides update/delete functionality.

### `backend.js`

Contains frontend functions for communicating with the Flask API.

It handles:

* Authentication requests
* Saved book requests
* Mood check-in requests

All requests include credentials so the Flask session can be maintained.

### `openLibrary.js`

Contains the external Open Library API integration used for book recommendations.

---

## 8. Backend Structure

The Flask backend is organized into separate route modules.

```text
server/
├── routes/
│   ├── auth.py
│   ├── books.py
│   ├── mood_checkins.py
│   └── saved_books.py
│
├── app.py
├── auth_helpers.py
├── config.py
├── extensions.py
├── models.py
├── requirements.txt
└── .env
```

### `app.py`

Creates and configures the Flask application and registers the API routes.

### `models.py`

Contains the SQLAlchemy database models:

* `User`
* `Book`
* `SavedBook`
* `MoodCheckIn`

### `auth_helpers.py`

Contains authentication helper functionality, including the `login_required` decorator.

### `extensions.py`

Contains shared Flask extensions such as:

* SQLAlchemy
* Bcrypt

### `config.py`

Contains application configuration and environment-based settings.

### `routes/auth.py`

Handles:

* Signup
* Login
* Logout
* Current user/session verification

### `routes/saved_books.py`

Handles the full CRUD lifecycle for saved books and pagination.

### `routes/mood_checkins.py`

Handles the full CRUD lifecycle for mood check-ins and pagination.

---

## 9. Technologies Used

### Frontend

* React
* JavaScript
* Vite
* Tailwind CSS

### Backend

* Python
* Flask
* Flask-SQLAlchemy
* Flask-Bcrypt

### Database

* PostgreSQL

### External API

* Open Library API

### Authentication

* Flask session-based authentication
* Password hashing with Bcrypt

### Development Tools

* Git
* GitHub
* npm
* Python virtual environment

---

## 10. Setup Instructions

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Python 3
* PostgreSQL
* Git

---

## 11. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Read-My-Mood
```

---

## 12. Frontend Setup

Install the frontend dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## 13. Backend Setup

Open a terminal and move into the server directory:

```bash
cd server
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

---

## 14. Environment Variables

Create a `.env` file inside the `server` directory.

Example:

```env
DATABASE_URL=postgresql://username:password@localhost/read_my_mood
SECRET_KEY=your-secret-key
```

Use your own PostgreSQL username, password, database name, and secret key.

Do not commit the `.env` file to GitHub.

---

## 15. Database Setup

Create a PostgreSQL database for the application.

For example:

```text
read_my_mood
```

Make sure the `DATABASE_URL` in `.env` points to the correct database.

The Flask application can then initialize and use the SQLAlchemy models.

---

## 16. Run the Backend

From the `server` directory:

```bash
python app.py
```

The Flask development server will normally run at:

```text
http://127.0.0.1:5000
```

You should see a message similar to:

```text
Running on http://127.0.0.1:5000
```

---

## 17. Running the Complete Application

Two terminals are required during local development.

### Terminal 1 — Flask Backend

```powershell
cd Read-My-Mood\server
.\venv\Scripts\Activate.ps1
python app.py
```

### Terminal 2 — React Frontend

```powershell
cd Read-My-Mood
npm run dev
```

Then open the Vite URL shown in the terminal:

```text
http://localhost:5173
```

---

## 18. Application Flow

The main user experience is:

```text
Sign Up / Log In
       ↓
Choose a Mood
       ↓
Choose Reading Comfort Level
       ↓
Find Recommended Books
       ↓
Save a Book
       ↓
Manage Personal Shelf
       ↓
Create Mood Check-In
       ↓
Update or Delete Records
```

---

## 19. API Integration

Read My Mood uses the Open Library API for book discovery.

The frontend sends requests to Open Library based on the selected mood.

The results are transformed into book cards containing information such as:

* Title
* Author
* Cover image
* Open Library identifier

The selected book can then be saved to the application's PostgreSQL database.

This creates a separation between:

1. External book discovery
2. Application-owned user data

---

## 20. Error Handling

The application handles common errors on both the frontend and backend.

Examples include:

* Invalid login credentials
* Missing required fields
* Unauthenticated API requests
* Unauthorized access to another user's records
* Duplicate saved books
* Failed external API requests
* Empty search results

The frontend displays appropriate feedback instead of failing silently.

---

## 21. Accessibility and Responsive Design

The interface is designed to work across different screen sizes.

The application includes:

* Semantic HTML
* Accessible interactive controls
* Clear visual states
* Responsive layouts
* Loading feedback
* Error feedback
* Mobile-friendly book grids

Tailwind CSS is used for responsive styling and consistent UI design.

---

## 22. Security Considerations

The application includes several security measures:

* Passwords are hashed using Bcrypt.
* Authentication is handled using Flask sessions.
* Protected routes require authentication.
* User-owned resources are filtered by `user_id`.
* Users cannot update or delete another user's saved books.
* Users cannot access another user's mood check-ins.
* Environment variables are used for sensitive configuration.
* `.env` should not be committed to the repository.

---

## 23. Git and Repository Hygiene

The project uses Git for version control.

The repository should contain:

* Frontend source code
* Backend source code
* README documentation
* Dependency files
* Configuration files required to run the project

The following should **not** be committed:

```text
node_modules/
venv/
.env
__pycache__/
*.pyc
dist/
```

These files are excluded through `.gitignore` where appropriate.

---

## 24. Testing

The application was tested locally with both the React frontend and Flask backend running.

Testing covered the main application flow, including:

* User signup
* User login
* User logout
* Session restoration
* Book searching
* Saving books
* Viewing saved books
* Updating saved books
* Deleting saved books
* Creating mood check-ins
* Viewing mood check-ins
* Updating mood check-ins
* Deleting mood check-ins
* Pagination
* Authentication-protected routes
* Ownership-based access control

---

## 25. Future Improvements

Possible future enhancements include:

* Deploying the application publicly
* Adding a user dashboard
* Reading statistics and reports
* Book recommendations based on reading history
* More advanced mood categories
* AI-powered book recommendations
* Book search filters
* Reading goals
* Progress tracking
* Automated backend tests
* Automated frontend tests
* Improved pagination controls
* Loading skeletons and optimistic UI updates

---

## 26. Project Requirements Checklist

The final project addresses the main Project 2 requirements:

* [x] React frontend
* [x] Flask backend
* [x] PostgreSQL database
* [x] User authentication
* [x] Signup
* [x] Login
* [x] Logout
* [x] Session management
* [x] Password hashing
* [x] At least two relational resources
* [x] Saved Books CRUD
* [x] Mood Check-Ins CRUD
* [x] Ownership-based authorization
* [x] Pagination
* [x] External API integration
* [x] Responsive interface
* [x] README documentation
* [x] Git version control

---

## 27. Repository

GitHub Repository:

**<YOUR_PUBLIC_GITHUB_REPOSITORY_URL>**

Live Application:

**<YOUR_DEPLOYED_APPLICATION_URL>**

> Replace the placeholders above with the actual links before submission.

---

## 28. Conclusion

Read My Mood evolved from a React book recommendation interface into a complete full-stack productivity application.

The final application combines mood-based book discovery with personal reading management. Users can authenticate, discover books, save them to a personal shelf, manage their reading information, and record reflections through mood check-ins.

The project demonstrates full-stack application development, RESTful API design, relational database modeling, authentication, authorization, CRUD functionality, pagination, external API integration, and responsive React development.
