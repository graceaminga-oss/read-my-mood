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
      <div className="mb-7 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-[#B8D9C4] mb-2">
            Step 03 — New arrivals
          </p>

          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#F3ECDA]">
            Books for your mood
          </h2>

          <p className="text-[#C9D6C6] mt-2 font-sans">
            Matched for a {mood ? mood.toLowerCase() : 'your'} mood.
          </p>
        </div>

        {mood && (
          <span
            className="font-mono text-xs uppercase tracking-wider px-3 py-1.5 border-2 -rotate-1"
            style={{ borderColor: '#C08A32', color: '#C08A32', backgroundColor: '#F3ECDA' }}
          >
            {mood}
          </span>
        )}
      </div>

      {error && (
        <div className="mb-6 border border-[#8C4A3A] bg-[#3A2420] px-4 py-3 text-sm text-[#F0C9BC] font-sans">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {books.map((book, index) => {
          const bookId = book.key || book.cover_id || index;

          // One cover size, one fallback. If it fails to load, we show a
          // placeholder — no retry chain needed for a book cover.
          const coverURL = book.cover_id
            ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`
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
              className="group bg-[#F3ECDA] border border-[#D9CFB0] p-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_rgba(0,0,0,0.25)]"
            >
              <div className="overflow-hidden bg-[#E3DBC2] relative">
                {coverFailed || !coverURL ? (
                  <div className="w-full aspect-[2/3] flex flex-col items-center justify-center gap-2 p-6 border border-dashed border-[#B0A67F] text-center">
                    <span className="text-2xl">📕</span>
                    <p className="font-serif text-sm font-semibold text-[#5B5646] leading-snug line-clamp-3">
                      {book.title}
                    </p>
                    <span className="font-mono text-[10px] uppercase tracking-wide text-[#8C8368]">
                      Cover unavailable
                    </span>
                  </div>
                ) : (
                  <img
                    src={coverURL}
                    alt={`Cover of ${book.title}`}
                    onError={() => {
                      setFailedCovers((previous) => {
                        const next = new Set(previous);
                        next.add(bookId);
                        return next;
                      });
                    }}
                    className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}

                {isSaved && (
                  <span className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#C08A32] text-white flex items-center justify-center text-xs font-mono font-bold shadow">
                    ✓
                  </span>
                )}
              </div>

              <div className="pt-4 px-1 pb-1">
                <h3 className="font-serif font-semibold text-[#1B2A22] leading-snug line-clamp-2">
                  {book.title}
                </h3>

                <p className="text-sm text-[#7C7660] mt-1 line-clamp-1 font-sans">
                  {author}
                </p>

                <button
                  type="button"
                  onClick={() => handleSaveBook(book)}
                  disabled={isSaving || isSaved}
                  className="w-full mt-4 border-2 border-[#1B2A22] bg-[#1B2A22] text-[#F3ECDA] py-2.5 text-sm font-mono uppercase tracking-wide hover:bg-[#F3ECDA] hover:text-[#1B2A22] disabled:opacity-60 disabled:hover:bg-[#1B2A22] disabled:hover:text-[#F3ECDA] transition-colors"
                >
                  {isSaving ? 'Checking out…' : isSaved ? 'On your shelf' : 'Check out'}
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
