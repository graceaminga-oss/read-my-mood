import { useEffect, useState } from 'react';

import MoodPicker from './components/MoodPicker';
import ComfortMeter from './components/ComfortMeter';
import BookShelf from './components/BookShelf';
import AuthForm from './components/AuthForm';
import MyShelf from './components/MyShelf';
import MoodCheckIns from './components/MoodCheckIns';
import MoodCheckInForm from './components/MoodCheckInForm';
import { searchBooks } from './api/openLibrary';
import {
  getCurrentUser,
  logout,
  getSavedBooks,
} from './api/backend';

function App() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [mood, setMood] = useState(null);
  const [comfortLevel, setComfortLevel] = useState(null);
  const [books, setBooks] = useState([]);
  const [savedBooks, setSavedBooks] = useState([]);
  const [status, setStatus] = useState('idle');
  const [checkInRefreshKey, setCheckInRefreshKey] = useState(0);

  // Check whether the user already has a valid Flask session.
  useEffect(() => {
    async function restoreSession() {
      try {
        const result = await getCurrentUser();
        setUser(result.user);

        const savedBooksResult = await getSavedBooks();
        setSavedBooks(savedBooksResult.saved_books || []);
      } catch {
        setUser(null);
      } finally {
        setLoadingAuth(false);
      }
    }

    restoreSession();
  }, []);

  async function handleLogout() {
    try {
      await logout();
      setUser(null);
      startOver();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  async function handleFindBooks() {
    setStatus('loading');

    try {
      const result = await searchBooks(mood);

      const works = result.works || [];

      setBooks(works);

      if (works.length > 0) {
        setStatus('results');
      } else {
        setStatus('empty');
      }
    } catch (error) {
      console.error('Book search failed:', error);
      setStatus('error');
    }
  }

  function handleBookSaved(savedBook) {
  setSavedBooks((previous) => {
    const alreadyExists = previous.some(
      (book) => book.id === savedBook.id
    );

    if (alreadyExists) {
      return previous;
    }

    return [...previous, savedBook];
  });
}

  function startOver() {
    setMood(null);
    setComfortLevel(null);
    setBooks([]);
    setStatus('idle');
  }

  function handleLogin(loggedInUser) {
    setUser(loggedInUser);
  }

  // While we check the Flask session, don't show the wrong screen.
  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-500">
          Checking your session...
        </p>
      </div>
    );
  }

  // If there is no logged-in user, show authentication.
  if (!user) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Navigation */}
        <nav className="flex items-center justify-between mb-12">
          <div>
            <p className="font-bold text-xl">
              Read My Mood
            </p>

            <p className="text-sm text-stone-500">
              Welcome, {user.name}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="
              px-4
              py-2
              rounded-full
              border
              border-stone-300
              text-sm
              font-medium
              hover:bg-stone-100
              transition
            "
          >
            Sign out
          </button>
        </nav>

        {/* Hero Section */}
        <header className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.2em] text-stone-500 mb-4">
            Your next read starts here
          </p>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-5">
            Read My Mood
          </h1>

          <p className="text-lg sm:text-xl text-stone-500 max-w-xl mx-auto leading-relaxed">
            Not sure what to read?
            Tell us how you're feeling and we'll find
            something that fits the moment.
          </p>
        </header>

        <main className="space-y-12">

          {/* Step 1 */}
          <section>
            <div className="mb-6">
              <p className="text-sm font-semibold text-stone-400 uppercase tracking-wider">
                01
              </p>

              <h2 className="text-2xl font-bold mt-1">
                How are you feeling?
              </h2>

              <p className="text-stone-500 mt-1">
                Choose the mood that best matches you right now.
              </p>
            </div>

            <MoodPicker
              mood={mood}
              setMood={setMood}
            />
          </section>

          {/* Step 2 */}
          <section>
            <div className="mb-6">
              <p className="text-sm font-semibold text-stone-400 uppercase tracking-wider">
                02
              </p>

              <h2 className="text-2xl font-bold mt-1">
                How much do you want to read?
              </h2>

              <p className="text-stone-500 mt-1">
                Choose how much reading comfort you want.
              </p>
            </div>

            <ComfortMeter
              comfortLevel={comfortLevel}
              setComfortLevel={setComfortLevel}
            />
          </section>

          {/* Selection Summary */}
          {mood && comfortLevel && status === 'idle' && (
            <section className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <p className="text-sm font-semibold text-stone-400 uppercase tracking-wider mb-3">
                Your reading mood
              </p>

              <h2 className="text-2xl font-bold mb-2">
                Ready to find your next book?
              </h2>

              <p className="text-stone-500 mb-6">
                You've chosen a{' '}
                <span className="font-semibold text-stone-700">
                  {mood}
                </span>{' '}
                mood with reading level{' '}
                <span className="font-semibold text-stone-700">
                  {comfortLevel}
                </span>.
              </p>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleFindBooks}
                  className="
                    px-8
                    py-3.5
                    rounded-full
                    bg-stone-800
                    text-white
                    font-semibold
                    shadow-sm
                    hover:bg-stone-700
                    hover:-translate-y-0.5
                    transition-all
                  "
                >
                  ✨ Find My Books
                </button>
              </div>
            </section>
          )}

          {/* Loading */}
          {status === 'loading' && (
            <section className="text-center py-14">
              <div className="flex justify-center gap-2 mb-5">
                <span className="w-3 h-3 rounded-full bg-stone-400 animate-bounce" />

                <span
                  className="w-3 h-3 rounded-full bg-stone-400 animate-bounce"
                  style={{ animationDelay: '0.15s' }}
                />

                <span
                  className="w-3 h-3 rounded-full bg-stone-400 animate-bounce"
                  style={{ animationDelay: '0.3s' }}
                />
              </div>

              <h2 className="text-xl font-semibold mb-2">
                Finding your matches...
              </h2>

              <p className="text-stone-500">
                Looking for books that fit your mood.
              </p>
            </section>
          )}

          {/* Error */}
          {status === 'error' && (
            <section className="bg-red-50 border border-red-100 rounded-3xl p-8 text-center">
              <h2 className="text-xl font-semibold text-red-800 mb-2">
                Something went wrong
              </h2>

              <p className="text-red-600 mb-5">
                We couldn't connect to the book library.
              </p>

              <button
                type="button"
                onClick={handleFindBooks}
                className="
                  px-5
                  py-2.5
                  rounded-full
                  bg-red-700
                  text-white
                  font-medium
                  hover:bg-red-800
                  transition
                "
              >
                Try Again
              </button>
            </section>
          )}

          {/* Empty Results */}
          {status === 'empty' && (
            <section className="bg-white border border-stone-200 rounded-3xl p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">
                We couldn't find any matches
              </h2>

              <p className="text-stone-500 mb-5">
                Try choosing a different mood and search again.
              </p>

              <button
                type="button"
                onClick={startOver}
                className="text-sm font-semibold underline"
              >
                Start over
              </button>
            </section>
          )}

          {/* Results */}
          {status === 'results' && (
            <section>
              <div className="mb-7">
                <p className="text-sm font-semibold text-stone-400 uppercase tracking-wider">
                  03
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  Your Mood Matches ✨
                </h2>

                <p className="text-stone-500 mt-1">
                  Here are some books we found for you.
                </p>
              </div>

              <BookShelf
                books={books}
                mood={mood}
                comfortLevel={comfortLevel}
                onBookSaved={handleBookSaved}
              />

              <div className="text-center mt-10">
                <button
                  type="button"
                  onClick={startOver}
                  className="
                    text-sm
                    font-medium
                    text-stone-500
                    underline
                    hover:text-stone-800
                    transition
                  "
                >
                  Start over
                </button>
              </div>
            </section>
          )}

        </main>

         <MyShelf
  savedBooks={savedBooks}
  setSavedBooks={setSavedBooks}
       />

         {savedBooks.length > 0 && (
           <>
             <MoodCheckInForm
               savedBooks={savedBooks}
               onCreated={() => {
                 setCheckInRefreshKey((previous) => previous + 1);
               }}
             />

             <MoodCheckIns refreshKey={checkInRefreshKey} />
           </>
         )}

        <footer className="text-center mt-20 pt-8 border-t border-stone-200">
          <p className="text-sm text-stone-400">
            Read My Mood · Find a book that fits the moment.
          </p>
        </footer>

      </div>
    </div>
  );
}

export default App;