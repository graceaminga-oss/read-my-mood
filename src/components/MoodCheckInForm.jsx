import { useState } from 'react';
import { createMoodCheckIn } from '../api/backend';

function MoodCheckInForm({ savedBooks, onCreated }) {
  const inputClasses =
    'w-full border border-[#D9CFB0] px-3 py-3 outline-none focus:border-[#C08A32] font-sans bg-white/40';

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
        <p className="font-mono text-xs tracking-[0.25em] uppercase text-[#B8D9C4] mb-2">
          Reflection slip
        </p>

        <h2 className="font-serif text-3xl font-semibold text-[#F3ECDA]">
          How did your book make you feel?
        </h2>

        <p className="text-[#C9D6C6] mt-2 font-sans">
          Record your mood after reading, and compare it to what you expected.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#F3ECDA] border border-[#D9CFB0] p-6 sm:p-8"
      >
        {error && (
          <div className="mb-5 border border-[#8C4A3A] bg-[#FBE9E3] px-4 py-3 text-sm text-[#8C4A3A] font-sans">
            {error}
          </div>
        )}

        <div className="mb-5">
          <label className="block text-xs font-mono uppercase tracking-wider text-[#7C7660] mb-2">
            Book
          </label>

          <select
            value={savedBookId}
            onChange={(event) => setSavedBookId(event.target.value)}
            required
            className={`${inputClasses} bg-[#F3ECDA]`}
          >
            <option value="">Choose a book from your shelf</option>

            {savedBooks.map((savedBook) => (
              <option key={savedBook.id} value={savedBook.id}>
                {savedBook.book.title}
              </option>
            ))}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-x-5 gap-y-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#7C7660] mb-2">
              Intended mood
            </label>

            <input
              type="text"
              value={intendedMood}
              onChange={(event) => setIntendedMood(event.target.value)}
              placeholder="e.g. Relaxed"
              className={inputClasses}
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#7C7660] mb-2">
              Actual mood
            </label>

            <input
              type="text"
              value={actualMood}
              onChange={(event) => setActualMood(event.target.value)}
              placeholder="e.g. Happy"
              required
              className={inputClasses}
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-xs font-mono uppercase tracking-wider text-[#7C7660] mb-2">
            Reflection
          </label>

          <textarea
            value={reflection}
            onChange={(event) => setReflection(event.target.value)}
            placeholder="How did the book affect your mood?"
            rows={4}
            className="w-full border border-[#D9CFB0] px-3 py-3 resize-none outline-none focus:border-[#C08A32] font-sans bg-white/40"
          />
        </div>

        <button
          type="submit"
          disabled={loading || savedBooks.length === 0}
          className="w-full mt-6 border-2 border-[#1B2A22] bg-[#1B2A22] text-[#F3ECDA] py-3 font-mono uppercase tracking-wide hover:bg-[#F3ECDA] hover:text-[#1B2A22] disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving…' : 'Save check-in'}
        </button>
      </form>
    </section>
  );
}

export default MoodCheckInForm;
