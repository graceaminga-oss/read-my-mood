import { useEffect, useState } from 'react';
import {
  getMoodCheckIns,
  deleteMoodCheckIn,
} from '../api/backend';

function MoodCheckIns({ refreshKey }) {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) {
    return (
      <section className="text-center py-12">
        <p className="text-stone-500">
          Loading your mood check-ins...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <p className="text-red-700">
          {error}
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
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <p className="text-sm text-stone-400">
                    Check-in
                  </p>

                  <h3 className="text-xl font-semibold text-stone-800 mt-1">
                    {checkin.actual_mood}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(checkin.id)}
                  className="text-sm font-semibold text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
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
                  #{checkin.saved_book_id}
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
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MoodCheckIns;