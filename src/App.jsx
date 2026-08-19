import {useEffect, useState} from 'react';
import MoodPicker from './components/MoodPicker';
import ComfortMeter from './components/ComfortMeter';
import BookShelf from './components/BookShelf';
import { searchBooks } from './api/openLibrary';

function App() {
  const [mood, setMood] = useState(null);

  const [comfortLevel, setComfortLevel] = useState(null);

  const [books, setBooks] = useState([])

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState(null)

  useEffect(() => {
  if (!mood) return;

  async function fetchBooks() {
    setLoading(true);
    setError(null);

    try {
      const result = await searchBooks(mood);
      setBooks(result.works);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  fetchBooks();
}, [mood, comfortLevel]);

  return (
  <div className="max-w-5xl mx-auto px-6 py-10">
    <header className="mb-10">
    <h1 className="text-4xl font-bold text-stone-800 mb-2">Read My Mood</h1>
    <p className="text-lg text-gray-500 mb-8">Welcome to Read My Mood!</p>
</header>

<main className="space-y-8">
    <MoodPicker mood={mood} setMood={setMood} />
    <ComfortMeter comfortLevel={comfortLevel} setComfortLevel={setComfortLevel} />
    {loading && <p className="text-lg text-gray-500">Fetching your books...</p>}
    {error && <p className="text-lg text-red-600">Something went wrong: {error}</p>}
    {!loading && !error && (
      <section className="pt-4">
        <BookShelf books={books} />
      </section>
    )}
    </main>
  </div>
);
}

export default App;