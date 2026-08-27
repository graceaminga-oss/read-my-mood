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
      <div className="mb-7 sm:mb-9">
        <p className="font-['Courier_Prime'] text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#B8D9C4] mb-2">
          Your recommendations
        </p>

        <h2 className="font-['Fraunces'] text-3xl sm:text-4xl font-semibold text-[#F3ECDA] mb-2 leading-tight">
          Books for your mood ✨
        </h2>

        <p className="font-['Public_Sans'] text-sm sm:text-base text-[#C9D6C6] leading-6">
          Here are some books that might be a good match.
        </p>
      </div>

      {error && (
        <div className="mb-6 border border-[#8C4A3A] bg-[#3A2420] px-4 py-3">
          <p className="font-['Public_Sans'] text-sm text-[#F0C9BC]"></p>
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
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
                bg-[#F3ECDA]
                border border-[#D9CFB0]
                overflow-hidden
                shadow-sm
              "
            >
              <div className="bg-[#EDE8D9]">
                {coverFailed || !largeCoverURL ? (
                  <div className="w-full aspect-[2/3] flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">
                      📖
                    </div>

                    <p className="font-['Fraunces'] text-sm sm:text-base font-semibold text-[#1B2A22] leading-snug">
                      {book.title}
                    </p>

                    <p className="font-['Public_Sans'] text-xs text-[#7C7660] mt-2">
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
                    className="w-full
                      aspect-[2/3]
                      object-cover
                      transition-transform
                      duration-300
                      group-hover:scale-[1.02]
                    "
                  />
                )}
              </div>

              <div className="pt-4 px-3 pb-3 sm:px-4 sm:pb-4">
                <h3
                  className="
                    font-['Fraunces']
                    text-sm
                    sm:text-base
                    font-semibold
                    text-[#1B2A22]
                    leading-snug
                    line-clamp-2
                  "
                >
                  {book.title}
                </h3>

                <p className="font-['Public_Sans'] text-xs sm:text-sm text-[#5B5646] mt-1 line-clamp-1">
                  {author}
                </p>

                <button
                  type="button"
                  onClick={() => handleSaveBook(book)}
                  disabled={isSaving || isSaved}
                  className="
                    w-full
                    mt-4
                    bg-[#21402F]
                    text-[#F3ECDA]
                    py-2.5
                    text-[11px]
                    sm:text-xs
                    font-['Courier_Prime']
                    uppercase
                    tracking-wide
                    hover:bg-[#162E21]
                    disabled:opacity-60
                    transition-colors
                    duration-200
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