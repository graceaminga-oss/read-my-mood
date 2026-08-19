# Read My Mood

A simple **React frontend** that recommends books based on the user's **mood** and **reading comfort level**.

## 1. Project Overview

Read My Mood helps users find a book that matches both how they feel and how much reading they can handle at the moment.

The app uses two independent selections:

* **Mood** — Cozy, Adventurous, Heartbroken, or Curious
* **Comfort Level** — a scale from 1 to 5, from a quick/easy read to a longer/challenging read

After making their selections, users receive a shelf of book recommendations from the Open Library API.

---

## 2. Scope

focuses on building the **React frontend**.

### Included

* React frontend
* Mood selection
* Reading comfort selection
* Open Library API integration
* Book recommendations
* Responsive book shelf
* Loading state
* Error handling
* Basic accessibility

---

## 3. Setting Up the Project

### Create the React Project

The project was created using Vite:

```bash
npm create vite@latest read-my-mood -- --template react
cd read-my-mood
npm install
```

### Install Tailwind CSS

Tailwind CSS is used to style the frontend:

```bash
npm install tailwindcss @tailwindcss/vite
```

### Run the Application

Start the development server:

```bash
npm run dev
```

Open the local development URL provided by Vite in the terminal.

---

## 4. How the App Works

The main user flow is:

**Choose a mood → Choose a comfort level → View book recommendations**

When the user changes their selections, the application automatically fetches book recommendations.

There is no separate search button.

The app displays:

* A loading message while books are being fetched
* An error message if the request fails
* The recommended books when the request is successful

---

## 5. Project Structure

```text
src/
├── api/
│   └── openLibrary.js
├── components/
│   ├── BookShelf.jsx
│   ├── ComfortMeter.jsx
│   └── MoodPicker.jsx
└── App.jsx
```

### `App.jsx`

The main application component.

It manages the shared application state and coordinates the other components.

### `MoodPicker.jsx`

Allows the user to select one of four moods:

* Cozy
* Adventurous
* Heartbroken
* Curious

### `ComfortMeter.jsx`

Allows the user to select a reading comfort level from 1–5.

The book icons fill progressively based on the selected level.

### `BookShelf.jsx`

Displays the recommended books in a responsive grid.

Each book displays its cover and title.

### `openLibrary.js`

Contains the API logic used to fetch books from Open Library.

Keeping the API logic separate from the components makes the code easier to organize and maintain.

---

## 6. API Integration

the project uses the **Open Library API** to retrieve book recommendations.

The application maps the selected mood to an Open Library subject and requests up to 20 results.

The API request is handled using JavaScript's `fetch`.

### Async Request Handling

The API logic uses **`async/await`** to handle the asynchronous request.

The request is wrapped in **`try/catch/finally`** so the application can handle each stage of the request:

```javascript
try {
  // Fetch book data
} catch (error) {
  // Handle the error
} finally {
  // Finish loading
}
```

This allows the application to:

1. Start the request.
2. Wait for the API response using `await`.
3. Update the books when the request succeeds.
4. Display an error if the request fails.
5. Always reset the loading state when the request finishes.

---

## 7. State Management

The project uses React's built-in `useState` and `useEffect`.

The main state includes:

| State          | Purpose                                      |
| -------------- | -------------------------------------------- |
| `mood`         | Stores the selected mood                     |
| `comfortLevel` | Stores the selected reading level from 1–5   |
| `books`        | Stores the fetched book results              |
| `loading`      | Tracks whether a request is in progress      |
| `error`        | Stores an error message when a request fails |

The shared state is kept in `App.jsx` and passed to the child components using props.

---

## 8. Key React Concepts

This project demonstrates:

* **`useState`** for managing application state
* **`useEffect`** for responding to changes and fetching data
* **Props** for passing data between components
* **Conditional rendering** for loading, error, and successful states
* **Component-based UI design**
* **`fetch`** for API requests
* **`async/await`** for asynchronous operations
* **`try/catch/finally`** for error handling and loading management

---

## 9. UI & Accessibility

The frontend uses Tailwind CSS to create a responsive interface.

The main UI features include:

* Mood buttons with visual selected states
* Interactive comfort-level meter
* Responsive book grid
* Hover effects on book covers
* Loading feedback
* Error feedback

The application also uses semantic HTML and `aria-label`s on the comfort-level buttons to make the interface more accessible.

---

## 10. Design Decisions

### Independent Mood and Comfort Level

Mood and comfort level are intentionally separate.

For example, a user can be:

* **Heartbroken + Comfort Level 5**
* **Cozy + Comfort Level 1**

The app does not assume that a particular mood determines how difficult a book should be.

### 20 Book Limit

The results are limited to 20 books so that the recommendation shelf remains manageable and easy to browse.

### No Separate Search Button

The app automatically fetches recommendations when the user's selections change.

This keeps the interaction simple:

**Select → Fetch → Browse**

---

## 11. Phase 1 Limitations

The current version does not include:

* Backend integration
* Database storage
* Authentication
* User accounts
* Saved books
* Favorites
* Pagination
* Automated tests

These features can be considered for future development.

---

## 12. Future Improvements

Possible improvements for later phases include:

* Adding a backend
* Adding user authentication
* Saving favorite books
* Adding user accounts
* Adding a database
* Improving book recommendations based on comfort level
* Adding pagination or a "Load More" option
* Adding automated tests
* Adding caching to avoid unnecessary API requests

---

## 13. Tech Stack

* **React**
* **Vite**
* **Tailwind CSS**
* **JavaScript**
* **Open Library API**

---

## Summary

The goal is to create a working **React frontend** that demonstrates:

* Component-based development
* React state management
* User interaction
* API integration
* Asynchronous data handling
* Error and loading states
* Responsive UI

The final user flow is:

**Choose a mood → Choose a comfort level → Get book recommendations**
”