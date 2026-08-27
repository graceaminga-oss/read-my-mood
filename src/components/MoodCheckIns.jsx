import { useEffect, useState } from 'react';

import {
  getMoodCheckIns,
  deleteMoodCheckIn,
  updateMoodCheckIn,
} from '../api/backend';

function MoodCheckIns({ refreshKey, savedBooks = [] }) {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [intendedMood, setIntendedMood] = useState('');
  const [actualMood, setActualMood] = useState('');
  const [reflection, setReflection] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadCheckIns() {
      setLoading(true);
      setError('');

      try {
        const result = await getMoodCheckIns();
        setCheckins(result.mood_checkins || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadCheckIns();
  }, [refreshKey]);

  function startEditing(checkin) {
    setEditingId(checkin.id);
    setIntendedMood(checkin.intended_mood || '');
    setActualMood(checkin.actual_mood || '');
    setReflection(checkin.reflection || '');
    setError('');
  }

  function cancelEditing() {
    setEditingId(null);
    setIntendedMood('');
    setActualMood('');
    setReflection('');
  }

  async function handleUpdate(checkinId) {
    setError('');
    setSaving(true);

    try {
      const result = await updateMoodCheckIn(checkinId, {
        intended_mood: intendedMood,
        actual_mood: actualMood,
        reflection,
      });

      setCheckins((previous) =>
        previous.map((checkin) =>
          checkin.id === checkinId
            ? result.mood_checkin
            : checkin
        )
      );

      cancelEditing();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(checkinId) {
    setError('');

    try {
      await deleteMoodCheckIn(checkinId);

      setCheckins((previous) =>
        previous.filter((checkin) => checkin.id !== checkinId)
      );
    } catch (err) {
      setError(err.message);
    }
  }

  function getBookTitle(savedBookId) {
    const savedBook = savedBooks.find(
      (book) => book.id === savedBookId
    );

    return savedBook?.book?.title || `Book #${savedBookId}`;
  }

  if (loading) {
    return (
      <section className="text-center py-10 sm:py-12">
        <p className="font-['Public_Sans'] text-sm text-[#C9D6C6]">
          Loading your mood check-ins...
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto mt-14 sm:mt-16 lg:mt-20 px-4 sm:px-6 lg:px-8">
      <div className="mb-7 sm:mb-9">
        <p className="font-['Courier_Prime'] text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#B8D9C4]">
          Your reflections
        </p>

        <h2 className="font-['Fraunces'] text-3xl sm:text-4xl font-semibold text-[#F3ECDA] mt-2">
          Mood Check-ins
        </h2>

        <p className="font-['Public_Sans'] text-sm sm:text-base text-[#C9D6C6] mt-2 max-w-xl leading-6">
          Look back at how your reading made you feel.
        </p>
      </div>

      {error && (
        <div className="mb-6 border border-[#8C4A3A] bg-[#3A2420] px-4 py-3">
          <p className="font-['Public_Sans'] text-sm text-[#F0C9BC]">
            {error}
          </p>
        </div>
      )}

      {checkins.length === 0 ? (
        <div className="bg-[#F3ECDA] border border-[#D9CFB0] px-5 py-10 sm:p-12 text-center">
          <h3 className="font-['Fraunces'] text-xl sm:text-2xl font-semibold text-[#1B2A22] mb-2">
            No check-ins yet
          </h3>

          <p className="font-['Public_Sans'] text-sm sm:text-base text-[#5B5646] leading-6">
            Your reading reflections will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-5">
          {checkins.map((checkin) => (
            <article
              key={checkin.id}
              className="bg-[#F3ECDA] border border-[#D9CFB0] px-5 py-6 sm:p-7 shadow-sm"
            >
              {editingId === checkin.id ? (
                <>
                  <div className="mb-6">
                    <p className="font-['Courier_Prime'] text-[11px] uppercase tracking-wide text-[#7C7660]">
                      Editing check-in
                    </p>

                    <h3 className="font-['Fraunces'] text-xl sm:text-2xl font-semibold text-[#1B2A22] mt-1">
                      {getBookTitle(checkin.saved_book_id)}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-['Public_Sans'] text-sm font-semibold text-[#1B2A22] mb-2">
                        Intended mood
                      </label>

                      <input
                        type="text"
                        value={intendedMood}
                        onChange={(event) =>
                          setIntendedMood(event.target.value)
                        }
                        className="w-full border border-[#B0A67F] bg-[#FFFDF5] px-4 py-3 text-sm text-[#1B2A22] focus:outline-none focus:border-[#21402F]"
                      />
                    </div>

                    <div>
                      <label className="block font-['Public_Sans'] text-sm font-semibold text-[#1B2A22] mb-2">
                        Actual mood
                      </label>

                      <input
                        type="text"
                        value={actualMood}
                        onChange={(event) =>
                          setActualMood(event.target.value)
                        }
                        required
                        className="w-full border border-[#B0A67F] bg-[#FFFDF5] px-4 py-3 text-sm text-[#1B2A22] focus:outline-none focus:border-[#21402F]"
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="block font-['Public_Sans'] text-sm font-semibold text-[#1B2A22] mb-2">
                      Reflection
                    </label>

                    <textarea
                      value={reflection}
                      onChange={(event) =>
                        setReflection(event.target.value)
                      }
                      rows={4}
                      className="w-full border border-[#B0A67F] bg-[#FFFDF5] px-4 py-3 text-sm text-[#1B2A22] resize-none focus:outline-none focus:border-[#21402F]"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => handleUpdate(checkin.id)}
                      disabled={saving || !actualMood.trim()}
                      className="w-full sm:w-auto px-5 py-2.5 bg-[#21402F] text-[#F3ECDA] font-['Courier_Prime'] text-xs uppercase tracking-wide hover:bg-[#162E21] disabled:opacity-50 transition-colors duration-200"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>

                    <button
                      type="button"
                      onClick={cancelEditing}
                      disabled={saving}
                      className="w-full sm:w-auto px-5 py-2.5 border border-[#B0A67F] text-[#1B2A22] font-['Courier_Prime'] text-xs uppercase tracking-wide hover:bg-[#E9E2CE] transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <p className="font-['Courier_Prime'] text-[11px] uppercase tracking-wide text-[#7C7660]">
                        Check-in
                      </p>

                      <h3 className="font-['Fraunces'] text-xl sm:text-2xl font-semibold text-[#1B2A22] mt-1">
                        {checkin.actual_mood}
                      </h3>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => startEditing(checkin)}
                        className="font-['Courier_Prime'] text-xs uppercase tracking-wide text-[#21402F] underline underline-offset-4 hover:no-underline"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(checkin.id)}
                        className="font-['Courier_Prime'] text-xs uppercase tracking-wide text-[#8C4A3A] underline underline-offset-4 hover:no-underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <p className="font-['Public_Sans'] text-[#5B5646] leading-6">
                      <span className="font-semibold text-[#1B2A22]">
                        Intended mood:
                      </span>{' '}
                      {checkin.intended_mood || 'Not specified'}
                    </p>

                    <p className="font-['Public_Sans'] text-[#5B5646] leading-6">
                      <span className="font-semibold text-[#1B2A22]">
                        Saved book:
                      </span>{' '}
                      {getBookTitle(checkin.saved_book_id)}
                    </p>
                  </div>

                  {checkin.reflection && (
                    <div className="mt-5 border-l-2 border-[#C08A32] bg-[#EDE7D5] px-4 py-4">
                      <p className="font-['Courier_Prime'] text-[11px] uppercase tracking-wide text-[#7C7660] mb-1">
                        Reflection
                      </p>

                      <p className="font-['Public_Sans'] text-sm sm:text-base text-[#5B5646] leading-6">
                        {checkin.reflection}
                      </p>
                    </div>
                  )}

                  <p className="font-['Courier_Prime'] text-[11px] text-[#7C7660] mt-5">
                    {new Date(checkin.created_at).toLocaleDateString()}
                  </p>
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MoodCheckIns;