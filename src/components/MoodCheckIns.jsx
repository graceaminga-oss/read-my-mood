import { useEffect, useState } from 'react';

import {
  getMoodCheckIns,
  deleteMoodCheckIn,
} from '../api/backend';

function getMood(mood) {
  const moodColors = {
    happy: '#B8860B',
    calm: '#4F7C66',
    sad: '#537A9B',
    anxious: '#A05A3C',
    angry: '#8C4A3A',
    hopeful: '#6B7F3A',
  };

  return {
    color: moodColors[String(mood || '').toLowerCase()] || '#7C7660',
  };
}

function MoodCheckIns({ refreshKey, savedBooks = [] }) {
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

  function getBookTitle(savedBookId) {
    const savedBook = savedBooks.find(
      (book) => book.id === savedBookId
    );

    return savedBook?.book?.title || `Book #${savedBookId}`;
  }

  if (loading) {
    return (
      <section className="text-center py-12">
        <p className="font-mono text-[#7C7660] text-sm tracking-wide">
          pulling your reflections…
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="border border-[#8C4A3A] bg-[#3A2420] p-6">
        <p className="text-[#F0C9BC] font-sans">{error}</p>
      </section>
    );
  }

  return (
    <section className="mt-16">
      <div className="mb-7">
        <p className="font-mono text-xs tracking-[0.25em] uppercase text-[#B8D9C4] mb-2">
          Your reflections
        </p>

        <h2 className="font-serif text-3xl font-semibold text-[#F3ECDA]">
          Mood Check-ins
        </h2>

        <p className="text-[#C9D6C6] mt-2 font-sans">
          Look back at how your reading made you feel.
        </p>
      </div>

      {checkins.length === 0 ? (
        <div className="bg-[#F3ECDA] border border-dashed border-[#B0A67F] p-10 text-center">
          <h3 className="font-serif text-xl font-semibold text-[#1B2A22] mb-2">
            No check-ins yet
          </h3>

          <p className="text-[#5B5646] font-sans">
            Your reading reflections will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {checkins.map((checkin) => {
            const intendedTag = getMood(checkin.intended_mood);
            const actualTag = getMood(checkin.actual_mood);
            const moodShifted =
              checkin.intended_mood &&
              checkin.intended_mood !== checkin.actual_mood;

            return (
              <article
                key={checkin.id}
                className="bg-[#F3ECDA] border border-[#D9CFB0] p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-[#7C7660]">
                      {new Date(checkin.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                      })}
                    </p>

                    <h3 className="font-serif text-xl font-semibold text-[#1B2A22] mt-1">
                      {checkin.actual_mood}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(checkin.id)}
                    className="text-sm font-mono uppercase tracking-wide text-[#8C4A3A] hover:text-[#6E3A2D] self-start"
                  >
                    delete
                  </button>
                </div>

                {/* Intended → actual mood shift, stamped */}
                <div className="mt-4 inline-flex items-center gap-3 border-2 border-[#1B2A22]/60 px-3 py-2 -rotate-1 font-mono text-xs uppercase tracking-wide">
                  <span style={{ color: intendedTag.color }}>
                    {checkin.intended_mood || 'not set'}
                  </span>
                  <span className="text-[#7C7660]">→</span>
                  <span style={{ color: actualTag.color }}>
                    {checkin.actual_mood}
                  </span>
                  {moodShifted && (
                    <span className="text-[#7C7660] normal-case">(shifted)</span>
                  )}
                </div>

                <p className="text-sm text-[#7C7660] mt-3 font-sans">
                  Saved book: {getBookTitle(checkin.saved_book_id)}
                </p>

                {checkin.reflection && (
                  <div className="mt-4 border-l-2 border-[#D9CFB0] pl-4">
                    <p className="text-xs font-mono uppercase tracking-wider text-[#7C7660] mb-1">
                      Reflection
                    </p>

                    <p className="text-[#3A362A] font-sans italic">
                      {checkin.reflection}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default MoodCheckIns;
