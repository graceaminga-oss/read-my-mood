import { useEffect, useState } from 'react';

import {
  getSavedBooks,
  deleteSavedBook,
  updateSavedBook,
} from '../api/backend';

function getMood(mood) {
  const colors = {
    cozy: '#C08A32',
    hopeful: '#B8D9C4',
    melancholic: '#7C7660',
    adventurous: '#8C4A3A',
    reflective: '#6B7A8F',
  };

  return {
    color: colors[mood?.toLowerCase()] || '#7C7660',
  };
}

function MyShelf({ savedBooks, setSavedBooks }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSavedBooks() {
      try {
        const result = await getSavedBooks();
        setSavedBooks(result.saved_books || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadSavedBooks();
  }, [setSavedBooks]);

  async function handleDelete(savedBookId) {
    try {
      await deleteSavedBook(savedBookId);

      setSavedBooks((previous) =>
        previous.filter((book) => book.id !== savedBookId)
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleStatusChange(savedBookId, status) {
    try {
      const result = await updateSavedBook(savedBookId, {
        status,
      });

      setSavedBooks((previous) =>
        previous.map((book) =>
          book.id === savedBookId
            ? result.saved_book
            : book
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <section className="text-center py-12">
        <p className="font-mono text-[#7C7660] text-sm tracking-wide">
          fetching your shelf…
        </p>
      </section>
    );
  }

  return (
    <section className="mt-16">
      <div className="mb-7">
        <p className="font-mono text-xs tracking-[0.25em] uppercase text-[#B8D9C4] mb-2">
          Your collection
        </p>

        <h2 className="font-serif text-3xl font-semibold text-[#F3ECDA]">
          My Reading Shelf
        </h2>

        <p className="text-[#C9D6C6] mt-2 font-sans">
          Books you've checked out for your reading journey.
        </p>
      </div>

      {error && (
        <div className="mb-6 border border-[#8C4A3A] bg-[#3A2420] px-4 py-3 text-sm text-[#F0C9BC] font-sans">
          {error}
        </div>
      )}

      {savedBooks.length === 0 ? (
        <div className="bg-[#F3ECDA] border border-dashed border-[#B0A67F] p-10 text-center">
          <h3 className="font-serif text-xl font-semibold text-[#1B2A22] mb-2">
            Your shelf is empty
          </h3>

          <p className="text-[#5B5646] font-sans">
            Find a book that matches your mood and check it out here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {savedBooks.map((savedBook) => {
            const moodTag = getMood(savedBook.mood);

            return (
              <article
                key={savedBook.id}
                className="bg-[#F3ECDA] border border-[#D9CFB0] p-3 relative"
              >
                {/* Colored spine edge tying back to the mood ribbon */}
                <span
                  className="absolute left-0 top-0 bottom-0 w-1.5"
                  style={{ backgroundColor: moodTag.color }}
                  aria-hidden="true"
                />

                <div className="overflow-hidden bg-[#E3DBC2] ml-1">
                  {savedBook.book.cover_url ? (
                    <img
                      src={savedBook.book.cover_url}
                      alt={`Cover of ${savedBook.book.title}`}
                      className="w-full aspect-[2/3] object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] flex flex-col items-center justify-center gap-2 p-6 text-center">
                      <span className="text-3xl">📖</span>
                      <span className="font-mono text-[10px] uppercase tracking-wide text-[#8C8368]">
                        Cover unavailable
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4 px-1">
                  <h3 className="font-serif font-semibold text-[#1B2A22] leading-snug">
                    {savedBook.book.title}
                  </h3>

                  <p className="text-sm text-[#7C7660] mt-1 font-sans">
                    {savedBook.book.author}
                  </p>

                  {/* Stamp block — mood + comfort, the recurring "due date card" motif */}
                  <div className="mt-3 border-2 border-[#1B2A22]/60 px-2.5 py-2 -rotate-1 font-mono text-[11px] text-[#1B2A22] leading-relaxed">
                    <div className="flex justify-between">
                      <span className="text-[#7C7660]">mood</span>
                      <span style={{ color: moodTag.color }}>
                        {savedBook.mood || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7C7660]">comfort</span>
                      <span>{savedBook.comfort_level || '—'}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[#7C7660] mb-1">
                      Reading status
                    </label>

                    <select
                      value={savedBook.status || 'Want to Read'}
                      onChange={(event) =>
                        handleStatusChange(savedBook.id, event.target.value)
                      }
                      className="w-full border border-[#D9CFB0] px-2.5 py-2 text-sm bg-white/40 font-sans outline-none focus:border-[#C08A32]"
                    >
                      <option value="Want to Read">Want to Read</option>
                      <option value="Reading">Reading</option>
                      <option value="Finished">Finished</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(savedBook.id)}
                    className="w-full mt-3 border border-[#8C4A3A] text-[#8C4A3A] py-2 text-sm font-mono uppercase tracking-wide hover:bg-[#8C4A3A] hover:text-[#F3ECDA] transition-colors"
                  >
                    Return book
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default MyShelf;
