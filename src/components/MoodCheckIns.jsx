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
      <section className="text-center py-12">
        <p className="text-stone-500">
          Loading your mood check-ins...
        </p>
      </section>
    );
  }

  return (
    <section className="mt-16">
      <div className="mb-7">
        <p className="text-sm font-semibold text-stone-400 uppercase tracking-wider">
          Your reflections
        </p>

        <h2 className="text-3xl font-bold mt-1">
          Mood Check-ins
        </h2>

        <p className="text-stone-500 mt-2">
          Look back at how your reading made you feel.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-sm text-red-700">
            {error}
          </p>
        </div>
      )}

      {checkins.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-3xl p-10 text-center">
          <h3 className="text-xl font-semibold mb-2">
            No check-ins yet
          </h3>

          <p className="text-stone-500">
            Your reading reflections will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {checkins.map((checkin) => (
            <article
              key={checkin.id}
              className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm"
            >
              {editingId === checkin.id ? (
                <>
                  <div className="mb-5">
                    <p className="text-sm text-stone-400">
                      Editing check-in
                    </p>

                    <h3 className="text-xl font-semibold text-stone-800 mt-1">
                      {getBookTitle(checkin.saved_book_id)}
                    </h3>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        Intended mood
                      </label>

                      <input
                        type="text"
                        value={intendedMood}
                        onChange={(event) =>
                          setIntendedMood(event.target.value)
                        }
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
                        onChange={(event) =>
                          setActualMood(event.target.value)
                        }
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
                      onChange={(event) =>
                        setReflection(event.target.value)
                      }
                      rows={4}
                      className="w-full rounded-xl border border-stone-300 px-4 py-3 resize-none"
                    />
                  </div>

                  <div className="flex gap-3 mt-5">
                    <button
                      type="button"
                      onClick={() => handleUpdate(checkin.id)}
                      disabled={saving || !actualMood.trim()}
                      className="rounded-xl bg-stone-800 text-white px-5 py-2.5 font-semibold hover:bg-stone-700 disabled:opacity-50 transition"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>

                    <button
                      type="button"
                      onClick={cancelEditing}
                      disabled={saving}
                      className="rounded-xl border border-stone-300 px-5 py-2.5 font-semibold text-stone-700 hover:bg-stone-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <p className="text-sm text-stone-400">
                        Check-in
                      </p>

                      <h3 className="text-xl font-semibold text-stone-800 mt-1">
                        {checkin.actual_mood}
                      </h3>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => startEditing(checkin)}
                        className="text-sm font-semibold text-stone-700 hover:text-stone-900"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(checkin.id)}
                        className="text-sm font-semibold text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
                    <p className="text-stone-600">
                      <span className="font-medium">
                        Intended mood:
                      </span>{' '}
                      {checkin.intended_mood || 'Not specified'}
                    </p>

                    <p className="text-stone-600">
                      <span className="font-medium">
                        Saved book:
                      </span>{' '}
                      {getBookTitle(checkin.saved_book_id)}
                    </p>
                  </div>

                  {checkin.reflection && (
                    <div className="mt-4 bg-stone-50 rounded-xl p-4">
                      <p className="text-sm font-medium text-stone-700 mb-1">
                        Reflection
                      </p>

                      <p className="text-stone-600">
                        {checkin.reflection}
                      </p>
                    </div>
                  )}

                  <p className="text-xs text-stone-400 mt-4">
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