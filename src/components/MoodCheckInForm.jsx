import { useState } from 'react';
import { createMoodCheckIn } from '../api/backend';

function MoodCheckInForm({ savedBooks, onCreated }) {
  const [savedBookId, setSavedBookId] = useState('');
  const [intendedMood, setIntendedMood] = useState('');
  const [actualMood, setActualMood] = useState('');
  const [reflection, setReflection] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      const result = await createMoodCheckIn({
        saved_book_id: Number(savedBookId),
        intended_mood: intendedMood,
        actual_mood: actualMood,
        reflection,
      });

      onCreated(result.mood_checkin);

      setSavedBookId('');
      setIntendedMood('');
      setActualMood('');
      setReflection('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-16">
      <div className="mb-7">
        <p className="text-sm font-semibold text-stone-400 uppercase tracking-wider">
          Reflect
        </p>

        <h2 className="text-3xl font-bold mt-1">
          How did your book make you feel?
        </h2>

        <p className="text-stone-500 mt-2">
          Record your mood after reading.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm"
      >
        {error && (
          <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-5">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Book
          </label>

          <select
            value={savedBookId}
            onChange={(event) => setSavedBookId(event.target.value)}
            required
            className="w-full rounded-xl border border-stone-300 px-4 py-3 bg-white"
          >
            <option value="">Choose a saved book</option>

            {savedBooks.map((savedBook) => (
              <option
                key={savedBook.id}
                value={savedBook.id}
              >
                {savedBook.book.title}
              </option>
            ))}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Intended mood
            </label>

            <input
              type="text"
              value={intendedMood}
              onChange={(event) => setIntendedMood(event.target.value)}
              placeholder="e.g. Relaxed"
              className="w-full rounded-xl border border-stone-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Actual mood
            </label>

            <input
              type="text"
              value={actualMood}
              onChange={(event) => setActualMood(event.target.value)}
              placeholder="e.g. Happy"
              required
              className="w-full rounded-xl border border-stone-300 px-4 py-3"
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Reflection
          </label>

          <textarea
            value={reflection}
            onChange={(event) => setReflection(event.target.value)}
            placeholder="How did the book affect your mood?"
            rows={4}
            className="w-full rounded-xl border border-stone-300 px-4 py-3 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || savedBooks.length === 0}
          className="w-full mt-6 rounded-xl bg-stone-800 text-white py-3 font-semibold hover:bg-stone-700 disabled:opacity-50 transition"
        >
          {loading ? 'Saving...' : 'Save Check-in'}
        </button>
      </form>
    </section>
  );
}

export default MoodCheckInForm;