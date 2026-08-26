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
      <div className="min-h-screen bg-[#21402F] flex items-center justify-center">
        <p className="font-mono text-[#C9D6C6] text-sm tracking-wide">
          checking your session…
        </p>
      </div>
    );
  }

  // If there is no logged-in user, show authentication.
  if (!user) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#21402F] text-[#1B2A22]">
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Navigation */}
        <nav className="flex items-center justify-between mb-12">
          <div>
            <p className="font-serif font-semibold text-xl text-[#F3ECDA]">
              Read My Mood
            </p>

            <p className="font-mono text-xs text-[#B8D9C4] mt-0.5">
              welcome, {user.name}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 border border-[#F3ECDA]/30 text-[#F3ECDA] text-sm font-mono uppercase tracking-wide hover:bg-[#F3ECDA]/10 transition-colors"
          >
            Sign out
          </button>
        </nav>

        {/* Hero Section */}
        <header className="text-center mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#B8D9C4] mb-4">
            Your next read starts here
          </p>

          <h1 className="font-serif text-5xl sm:text-6xl font-semibold tracking-tight text-[#F3ECDA] mb-5">
            Read My Mood
          </h1>

          <p className="text-lg sm:text-xl text-[#C9D6C6] max-w-xl mx-auto leading-relaxed font-sans">
            Not sure what to read? Tell us how you're feeling and we'll find
            something that fits the moment.
          </p>
        </header>

        <main className="space-y-12">

          {/* Step 1 */}
          <section className="bg-[#F3ECDA] border border-[#D9CFB0] p-6 sm:p-8">
            <MoodPicker
              mood={mood}
              setMood={setMood}
            />
          </section>

          {/* Step 2 */}
          <section className="bg-[#F3ECDA] border border-[#D9CFB0] p-6 sm:p-8">
            <ComfortMeter
              comfortLevel={comfortLevel}
              setComfortLevel={setComfortLevel}
            />
          </section>

          {/* Selection Summary */}
          {mood && comfortLevel && status === 'idle' && (
            <section className="bg-[#F3ECDA] border border-[#D9CFB0] p-6 sm:p-8 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#7C7660] mb-3">
                Your reading mood
              </p>

              <h2 className="font-serif text-2xl font-semibold text-[#1B2A22] mb-2">
                Ready to find your next book?
              </h2>

              <p className="text-[#5B5646] mb-6 font-sans">
                You've chosen a{' '}
                <span className="font-semibold text-[#1B2A22]">{mood}</span>{' '}
                mood with reading level{' '}
                <span className="font-semibold text-[#1B2A22]">{comfortLevel}</span>.
              </p>

              <button
                type="button"
                onClick={handleFindBooks}
                className="px-8 py-3.5 border-2 border-[#1B2A22] bg-[#1B2A22] text-[#F3ECDA] font-mono uppercase tracking-wide hover:bg-[#F3ECDA] hover:text-[#1B2A22] transition-colors"
              >
                Find my books
              </button>
            </section>
          )}

          {/* Loading */}
          {status === 'loading' && (
            <section className="text-center py-14">
              <div className="flex justify-center gap-2 mb-5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C08A32] animate-bounce" />
                <span
                  className="w-2.5 h-2.5 rounded-full bg-[#C08A32] animate-bounce"
                  style={{ animationDelay: '0.15s' }}
                />
                <span
                  className="w-2.5 h-2.5 rounded-full bg-[#C08A32] animate-bounce"
                  style={{ animationDelay: '0.3s' }}
                />
              </div>

              <h2 className="font-serif text-xl font-semibold text-[#F3ECDA] mb-2">
                Finding your matches…
              </h2>

              <p className="text-[#C9D6C6] font-sans">
                Looking for books that fit your mood.
              </p>
            </section>
          )}

          {/* Error */}
          {status === 'error' && (
            <section className="bg-[#3A2420] border border-[#8C4A3A] p-8 text-center">
              <h2 className="font-serif text-xl font-semibold text-[#F0C9BC] mb-2">
                Something went wrong
              </h2>

              <p className="text-[#E0B3A4] mb-5 font-sans">
                We couldn't connect to the book library.
              </p>

              <button
                type="button"
                onClick={handleFindBooks}
                className="px-5 py-2.5 border-2 border-[#F0C9BC] text-[#F0C9BC] font-mono uppercase tracking-wide hover:bg-[#F0C9BC] hover:text-[#3A2420] transition-colors"
              >
                Try again
              </button>
            </section>
          )}

          {/* Empty Results */}
          {status === 'empty' && (
            <section className="bg-[#F3ECDA] border border-dashed border-[#B0A67F] p-8 text-center">
              <h2 className="font-serif text-xl font-semibold text-[#1B2A22] mb-2">
                We couldn't find any matches
              </h2>

              <p className="text-[#5B5646] mb-5 font-sans">
                Try choosing a different mood and search again.
              </p>

              <button
                type="button"
                onClick={startOver}
                className="text-sm font-mono uppercase tracking-wide underline text-[#1B2A22]"
              >
                Start over
              </button>
            </section>
          )}

          {/* Results */}
          {status === 'results' && (
            <section>
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
                  className="text-sm font-mono uppercase tracking-wide text-[#C9D6C6] underline hover:text-[#F3ECDA] transition-colors"
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

        <footer className="text-center mt-20 pt-8 border-t border-[#F3ECDA]/10">
          <p className="font-mono text-xs text-[#B8D9C4] tracking-wide">
            Read My Mood · Find a book that fits the moment.
          </p>
        </footer>

      </div>
    </div>
  );
}

export default App;