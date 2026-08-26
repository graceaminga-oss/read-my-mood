import { useEffect, useState } from 'react';

import {
  getSavedBooks,
  deleteSavedBook,
  updateSavedBook,
} from '../api/backend';

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
        <p className="text-stone-500">
          Loading your shelf...
        </p>
      </section>
    );
  }

  return (
    <section className="mt-16">
      <div className="mb-7">
        <p className="text-sm font-semibold text-stone-400 uppercase tracking-wider">
          Your collection
        </p>

        <h2 className="text-3xl font-bold mt-1">
          My Reading Shelf
        </h2>

        <p className="text-stone-500 mt-2">
          Books you've saved for your reading journey.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {savedBooks.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-3xl p-10 text-center">
          <h3 className="text-xl font-semibold mb-2">
            Your shelf is empty
          </h3>

          <p className="text-stone-500">
            Find a book that matches your mood and save it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {savedBooks.map((savedBook) => (
            <article
              key={savedBook.id}
              className="bg-white border border-stone-200 rounded-2xl p-3 shadow-sm"
            >
              <div className="overflow-hidden rounded-xl bg-stone-100">
                {savedBook.book.cover_url ? (
                  <img
                    src={savedBook.book.cover_url}
                    alt={`Cover of ${savedBook.book.title}`}
                    className="w-full aspect-[2/3] object-cover"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] flex flex-col items-center justify-center p-6 text-center">
                    <span className="text-4xl mb-3">
                      📖
                    </span>

                    <p className="text-sm text-stone-500">
                      Cover unavailable
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 px-1">
                <h3 className="font-semibold text-stone-800 leading-snug">
                  {savedBook.book.title}
                </h3>

                <p className="text-sm text-stone-500 mt-1">
                  {savedBook.book.author}
                </p>

                <div className="mt-3 space-y-1 text-sm text-stone-600">
                  <p>
                    <span className="font-medium">
                      Mood:
                    </span>{' '}
                    {savedBook.mood || 'Not specified'}
                  </p>

                  <p>
                    <span className="font-medium">
                      Comfort:
                    </span>{' '}
                    {savedBook.comfort_level || 'Not specified'}
                  </p>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-medium text-stone-500 mb-1">
                    Reading status
                  </label>

                  <select
                    value={savedBook.status || 'Want to Read'}
                    onChange={(event) =>
                      handleStatusChange(
                        savedBook.id,
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm bg-white"
                  >
                    <option value="Want to Read">
                      Want to Read
                    </option>

                    <option value="Reading">
                      Reading
                    </option>

                    <option value="Finished">
                      Finished
                    </option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(savedBook.id)}
                  className="w-full mt-3 rounded-xl border border-red-200 text-red-600 py-2 text-sm font-semibold hover:bg-red-50 transition"
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyShelf;