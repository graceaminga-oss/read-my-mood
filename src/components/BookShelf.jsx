import { useState } from 'react';

import { saveBook } from '../api/backend';

function BookShelf({ books, mood, comfortLevel, onBookSaved }) {
  const [savingId, setSavingId] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());
  const [error, setError] = useState('');
  const [failedCovers, setFailedCovers] = useState(new Set());

  async function handleSaveBook(book) {
    const bookId = book.key || book.cover_id;

    setSavingId(bookId);
    setError('');

    try {
      const author =
        book.authors && book.authors.length > 0
          ? book.authors[0].name
          : 'Unknown author';

      const coverURL = book.cover_id
        ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`
        : null;

      const result = await saveBook({
        open_library_id: book.key,
        title: book.title,
        author,
        cover_url: coverURL,
        mood,
        comfort_level: comfortLevel,
        status: 'Want to Read',
      });

      setSavedIds((previous) => {
        const next = new Set(previous);
        next.add(bookId);
        return next;
      });

      if (onBookSaved) {
        onBookSaved(result.saved_book);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div>
      <div className="mb-7">
        <p className="text-sm font-semibold text-stone-400 uppercase tracking-wider mb-2">
          Your recommendations
        </p>

        <h2 className="text-3xl font-bold text-stone-800 mb-2">
          Books for your mood ✨
        </h2>

        <p className="text-stone-500">
          Here are some books that might be a good match.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {books.map((book, index) => {
          const bookId = book.key || book.cover_id || index;

          const largeCoverURL = book.cover_id
            ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`
            : null;

          const mediumCoverURL = book.cover_id
            ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
            : null;

          const author =
            book.authors && book.authors.length > 0
              ? book.authors[0].name
              : 'Unknown author';

          const isSaving = savingId === bookId;
          const isSaved = savedIds.has(bookId);
          const coverFailed = failedCovers.has(bookId);

          return (
            <article
              key={`${bookId}-${index}`}
              className="
                group
                bg-white
                border border-stone-200
                rounded-2xl
                overflow-hidden
                shadow-sm
                hover:shadow-md
                transition-shadow
              "
            >
              <div className="bg-stone-100">
                {coverFailed || !largeCoverURL ? (
                  <div className="w-full aspect-[2/3] flex flex-col items-center justify-center p-6 text-center">
                    <div className="text-4xl mb-4">
                      📖
                    </div>

                    <p className="font-semibold text-stone-700 leading-snug">
                      {book.title}
                    </p>

                    <p className="text-xs text-stone-400 mt-2">
                      Cover unavailable
                    </p>
                  </div>
                ) : (
                  <img
                    src={largeCoverURL}
                    alt={`Cover of ${book.title}`}
                    onError={(event) => {
                      if (mediumCoverURL && event.currentTarget.src !== mediumCoverURL) {
                        event.currentTarget.src = mediumCoverURL;
                        return;
                      }

                      setFailedCovers((previous) => {
                        const next = new Set(previous);
                        next.add(bookId);
                        return next;
                      });
                    }}
                    className="
                      w-full
                      aspect-[2/3]
                      object-cover
                      group-hover:scale-105
                      transition-transform
                      duration-300
                    "
                  />
                )}
              </div>

              <div className="pt-4 px-3 pb-3">
                <h3
                  className="
                    font-semibold
                    text-stone-800
                    leading-snug
                    line-clamp-2
                  "
                >
                  {book.title}
                </h3>

                <p className="text-sm text-stone-500 mt-1 line-clamp-1">
                  {author}
                </p>

                <button
                  type="button"
                  onClick={() => handleSaveBook(book)}
                  disabled={isSaving || isSaved}
                  className="
                    w-full
                    mt-4
                    rounded-xl
                    bg-stone-800
                    text-white
                    py-2.5
                    text-sm
                    font-semibold
                    hover:bg-stone-700
                    disabled:opacity-60
                    transition
                  "
                >
                  {isSaving
                    ? 'Saving...'
                    : isSaved
                      ? '✓ Saved'
                      : 'Save Book'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default BookShelf;