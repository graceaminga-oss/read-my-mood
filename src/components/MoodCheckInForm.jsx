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
    <form
      onSubmit={handleSubmit}
      className="bg-[#F3ECDA] border border-[#D9CFB0] px-5 py-6 sm:p-8 lg:p-9 shadow-sm"
    >
      {error && (
        <div className="mb-6 border border-[#8C4A3A] bg-[#3A2420] px-4 py-3">
          <p className="font-['Public_Sans'] text-sm text-[#F0C9BC]">
            {error}
          </p>
        </div>
      )}

      <div className="mb-5">
        <label className="block font-['Public_Sans'] text-sm font-semibold text-[#1B2A22] mb-2">
          Book
        </label>

        <select
          value={savedBookId}
          onChange={(event) => setSavedBookId(event.target.value)}
          required
          className="w-full border border-[#B0A67F] bg-[#FFFDF5] px-4 py-3 text-sm text-[#1B2A22] focus:outline-none focus:border-[#21402F]"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block font-['Public_Sans'] text-sm font-semibold text-[#1B2A22] mb-2">
            Intended mood
          </label>

          <input
            type="text"
            value={intendedMood}
            onChange={(event) => setIntendedMood(event.target.value)}
            placeholder="e.g. Calm"
            className="w-full border border-[#B0A67F] bg-[#FFFDF5] px-4 py-3 text-sm text-[#1B2A22] placeholder:text-[#8B856F] focus:outline-none focus:border-[#21402F]"
          />
        </div>

        <div>
          <label className="block font-['Public_Sans'] text-sm font-semibold text-[#1B2A22] mb-2">
            Actual mood
          </label>

          <input
            type="text"
            value={actualMood}
            onChange={(event) => setActualMood(event.target.value)}
            placeholder="e.g. Happy"
            required
            className="w-full border border-[#B0A67F] bg-[#FFFDF5] px-4 py-3 text-sm text-[#1B2A22] placeholder:text-[#8B856F] focus:outline-none focus:border-[#21402F]"
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="block font-['Public_Sans'] text-sm font-semibold text-[#1B2A22] mb-2">
          Reflection
        </label>

        <textarea
          value={reflection}
          onChange={(event) => setReflection(event.target.value)}
          placeholder="How did the book affect your mood?"
          rows={4}
          className="w-full border border-[#B0A67F] bg-[#FFFDF5] px-4 py-3 text-sm text-[#1B2A22] placeholder:text-[#8B856F] resize-none focus:outline-none focus:border-[#21402F]"
        />
      </div>

      <button
        type="submit"
        disabled={loading || savedBooks.length === 0}
        className="w-full mt-6 bg-[#21402F] text-[#F3ECDA] py-3.5 px-5 font-['Courier_Prime'] text-xs sm:text-sm uppercase tracking-wide hover:bg-[#162E21] disabled:opacity-50 transition-colors duration-200"
      >
        {loading ? 'Saving...' : 'Save Check-in'}
      </button>
    </form>
  );
}

export default MoodCheckInForm;