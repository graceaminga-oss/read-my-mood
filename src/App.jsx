import { useEffect, useState } from 'react';

import MoodPicker from './components/MoodPicker';
import ComfortMeter from './components/ComfortMeter';
import BookShelf from './components/BookShelf';
import AuthForm from './components/AuthForm';
import MyShelf from './components/MyShelf';
import MoodCheckIns from './components/MoodCheckIns';
import MoodCheckInForm from './components/MoodCheckInForm';
import Navbar from './components/Navbar';

import { searchBooks } from './api/openLibrary';

import {
getCurrentUser,
logout,
getSavedBooks,
} from './api/backend';

function App() {
const [user, setUser] = useState(null);
const [loadingAuth, setLoadingAuth] = useState(true);

const [activeView, setActiveView] = useState('discover');

const [mood, setMood] = useState(null);
const [comfortLevel, setComfortLevel] = useState(null);
const [books, setBooks] = useState([]);
const [savedBooks, setSavedBooks] = useState([]);
const [status, setStatus] = useState('idle');
const [checkInRefreshKey, setCheckInRefreshKey] = useState(0);

// Restore the user's Flask session.
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
  setActiveView('discover');
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

// While checking the Flask session.
if (loadingAuth) {
return (
  <div className="min-h-screen bg-[#21402F] flex items-center justify-center">
    <p className="font-['Courier_Prime'] text-[#C9D6C6] text-sm tracking-wide">
      checking your session <span className="animate-pulse">_</span>
    </p>
  </div>
);
}

// Show authentication when there is no logged-in user.
if (!user) {
return <AuthForm onLogin={handleLogin} />;
}

return ( <div className="min-h-screen bg-[#21402F] text-[#1B2A22]"> <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

    {/* Navigation */}
    <Navbar
      activeView={activeView}
      setActiveView={setActiveView}
      user={user}
      onLogout={handleLogout}
    />

    {/* =========================
        DISCOVER
    ========================== */}
    {activeView === 'discover' && (
      <>
        {/* Hero */}
        <header className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 lg:mb-20">
          <p className="font-['Courier_Prime'] text-[11px] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.3em] text-[#B8D9C4] mb-4">
            Your next read starts here
          </p>

          <h1 className="font-['Fraunces'] text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight text-[#F3ECDA] mb-5">
            Read My Mood
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-[#C9D6C6] max-w-2xl mx-auto leading-7 sm:leading-8 font-['Public_Sans']">
            Not sure what to read? Tell us how you're feeling and we'll
            find something that fits the moment.
          </p>
        </header>

        <main className="max-w-4xl mx-auto space-y-8 sm:space-y-10 lg:space-y-12">

          {/* Mood */}
          <section className="bg-[#F3ECDA] border border-[#D9CFB0] px-4 py-6 sm:p-8 lg:p-9 shadow-sm">
            <MoodPicker
              mood={mood}
              setMood={setMood}
            />
          </section>

          {/* Comfort */}
          <section className="bg-[#F3ECDA] border border-[#D9CFB0] px-4 py-6 sm:p-8 lg:p-9 shadow-sm">
            <ComfortMeter
              comfortLevel={comfortLevel}
              setComfortLevel={setComfortLevel}
            />
          </section>

          {/* Selection Summary */}
          {mood && comfortLevel && status === 'idle' && (
            <section className="bg-[#F3ECDA] border-2 border-[#C08A32] px-5 py-7 sm:p-9 lg:p-10 text-center shadow-[6px_6px_0px_0px_rgba(192,138,50,0.25)]">

              <p className="font-['Courier_Prime'] text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#7C7660] mb-3">
                Your reading mood
              </p>

              <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-semibold text-[#1B2A22] leading-tight mb-3">
                Ready to find your next book?
              </h2>

              <p className="text-sm sm:text-base text-[#5B5646] mb-7 font-['Public_Sans'] leading-6">
                You've chosen a{' '}
                <span className="font-semibold text-[#1B2A22]">
                  {mood}
                </span>{' '}
                mood with reading level{' '}
                <span className="font-semibold text-[#1B2A22]">
                  {comfortLevel}
                </span>.
              </p>

              <button
                type="button"
                onClick={handleFindBooks}
                className="w-full sm:w-auto px-7 sm:px-9 py-3.5 border-2 border-[#1B2A22] bg-[#1B2A22] text-[#F3ECDA] font-['Courier_Prime'] text-sm uppercase tracking-wide hover:bg-transparent hover:text-[#1B2A22] hover:shadow-[4px_4px_0px_0px_#1B2A22] transition-all duration-200"
              >
                Find my books
              </button>
            </section>
          )}

          {/* Loading */}
          {status === 'loading' && (
            <section className="text-center py-10 sm:py-14">

              <div className="flex justify-center gap-2 mb-5">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#C08A32] animate-bounce" />

                <span
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#B8D9C4] animate-bounce"
                  style={{ animationDelay: '0.15s' }}
                />

                <span
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#F3ECDA] animate-bounce"
                  style={{ animationDelay: '0.3s' }}
                />
              </div>

              <h2 className="font-['Fraunces'] text-xl sm:text-2xl font-semibold text-[#F3ECDA] mb-2">
                Finding your matches…
              </h2>

              <p className="text-sm sm:text-base text-[#C9D6C6] font-['Public_Sans']">
                Looking for books that fit your mood.
              </p>
            </section>
          )}

          {/* Error */}
          {status === 'error' && (
            <section className="bg-[#3A2420] border border-[#8C4A3A] px-5 py-7 sm:p-9 text-center">

              <h2 className="font-['Fraunces'] text-xl sm:text-2xl font-semibold text-[#F0C9BC] mb-2">
                Something went wrong
              </h2>

              <p className="text-sm sm:text-base text-[#E0B3A4] mb-6 font-['Public_Sans'] leading-6">
                We couldn't connect to the book library.
              </p>

              <button
                type="button"
                onClick={handleFindBooks}
                className="w-full sm:w-auto px-5 py-2.5 border-2 border-[#F0C9BC] text-[#F0C9BC] font-['Courier_Prime'] text-sm uppercase tracking-wide hover:bg-[#F0C9BC] hover:text-[#3A2420] transition-all duration-200"
              >
                Try again
              </button>
            </section>
          )}

          {/* Empty */}
          {status === 'empty' && (
            <section className="bg-[#F3ECDA] border border-dashed border-[#B0A67F] px-5 py-7 sm:p-9 text-center">

              <h2 className="font-['Fraunces'] text-xl sm:text-2xl font-semibold text-[#1B2A22] mb-2">
                We couldn't find any matches
              </h2>

              <p className="text-sm sm:text-base text-[#5B5646] mb-6 font-['Public_Sans'] leading-6">
                Try choosing a different mood and search again.
              </p>

              <button
                type="button"
                onClick={startOver}
                className="text-sm font-['Courier_Prime'] uppercase tracking-wide underline underline-offset-4 decoration-[#C08A32] decoration-2 text-[#1B2A22] hover:no-underline"
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

              <div className="text-center mt-8 sm:mt-10">
                <button
                  type="button"
                  onClick={startOver}
                  className="text-sm font-['Courier_Prime'] uppercase tracking-wide text-[#C9D6C6] underline underline-offset-4 decoration-[#C08A32] decoration-2 hover:text-[#F3ECDA] hover:no-underline transition-colors duration-200"
                >
                  Start over
                </button>
              </div>

            </section>
          )}

        </main>
      </>
    )}

    {/* =========================
        MY SHELF
    ========================== */}
    {activeView === 'shelf' && (
      <main className="max-w-5xl mx-auto">
        <MyShelf
          savedBooks={savedBooks}
          setSavedBooks={setSavedBooks}
        />
      </main>
    )}

    {/* =========================
        MOOD JOURNAL
    ========================== */}
    {activeView === 'journal' && (
      <main className="max-w-4xl mx-auto">

        <header className="text-center mb-10 sm:mb-14">
          <p className="font-['Courier_Prime'] text-[11px] uppercase tracking-[0.25em] text-[#B8D9C4] mb-3">
            Your reading journey
          </p>

          <h1 className="font-['Fraunces'] text-4xl sm:text-5xl font-semibold text-[#F3ECDA] mb-4">
            Mood Journal
          </h1>

          <p className="text-sm sm:text-base text-[#C9D6C6] font-['Public_Sans']">
            Keep track of how your reading makes you feel.
          </p>
        </header>

        {savedBooks.length > 0 ? (
          <>
            <MoodCheckInForm
              savedBooks={savedBooks}
              onCreated={() => {
                setCheckInRefreshKey(
                  (previous) => previous + 1
                );
              }}
            />

            <MoodCheckIns
              refreshKey={checkInRefreshKey}
              savedBooks={savedBooks}
            />
          </>
        ) : (
          <section className="bg-[#F3ECDA] border border-[#D9CFB0] px-5 py-8 sm:p-10 text-center">

            <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-semibold text-[#1B2A22] mb-3">
              Your mood journal is waiting
            </h2>

            <p className="text-sm sm:text-base text-[#5B5646] font-['Public_Sans'] leading-6 mb-6">
              Save a book first, then you can start recording
              how your reading makes you feel.
            </p>

            <button
              type="button"
              onClick={() => setActiveView('discover')}
              className="px-6 py-3 border-2 border-[#1B2A22] bg-[#1B2A22] text-[#F3ECDA] font-['Courier_Prime'] text-sm uppercase tracking-wide hover:bg-transparent hover:text-[#1B2A22] transition-all duration-200"
            >
              Discover a book
            </button>

          </section>
        )}

      </main>
    )}

    {/* Footer */}
    <footer className="max-w-4xl mx-auto text-center mt-16 sm:mt-20 pt-7 sm:pt-8 border-t border-[#F3ECDA]/10">
      <p className="font-['Courier_Prime'] text-[11px] sm:text-xs text-[#B8D9C4] tracking-wide">
        Read My Mood{' '}
        <span className="text-[#C08A32]">·</span>{' '}
        Find a book that fits the moment.
      </p>
    </footer>

  </div>
</div>
);
}

export default App;
