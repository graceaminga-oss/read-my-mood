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
return ( <section className="max-w-5xl mx-auto py-16 text-center"> <p className="font-['Courier_Prime'] text-sm text-[#C9D6C6]">
loading your shelf <span className="animate-pulse">_</span> </p> </section>
);
}

return ( <section className="max-w-5xl mx-auto">

  {/* Page heading */}
  <header className="mb-8 sm:mb-10">
    <p className="font-['Courier_Prime'] text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#B8D9C4]">
      Your collection
    </p>

    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mt-2">
      <div>
        <h1 className="font-['Fraunces'] text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#F3ECDA] leading-tight">
          My Reading Shelf
        </h1>

        <p className="font-['Public_Sans'] text-sm sm:text-base text-[#C9D6C6] mt-2 max-w-xl leading-6">
          Books you've saved for your reading journey.
        </p>
      </div>

      <div className="font-['Courier_Prime'] text-xs uppercase tracking-wide text-[#B8D9C4]">
        {savedBooks.length}{' '}
        {savedBooks.length === 1 ? 'book' : 'books'}
      </div>
    </div>
  </header>

  {/* Error */}
  {error && (
    <div className="mb-6 border border-[#8C4A3A] bg-[#3A2420] px-4 py-3 text-sm text-[#F0C9BC]">
      {error}
    </div>
  )}

  {/* Empty state */}
  {savedBooks.length === 0 ? (
    <div className="bg-[#F3ECDA] border border-[#D9CFB0] px-5 py-12 sm:p-14 text-center">
      <div className="text-4xl mb-4">
        📚
      </div>

      <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-semibold text-[#1B2A22] mb-3">
        Your shelf is empty
      </h2>

      <p className="font-['Public_Sans'] text-sm sm:text-base text-[#5B5646] max-w-md mx-auto leading-6">
        Head over to Discover, find a book that matches your mood,
        and save it here.
      </p>
    </div>
  ) : (
    /* Saved books */
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
      {savedBooks.map((savedBook) => (
        <article
          key={savedBook.id}
          className="bg-[#F3ECDA] border border-[#D9CFB0] p-3 sm:p-4 shadow-sm"
        >
          {/* Cover */}
          <div className="overflow-hidden bg-[#E5DDC6]">
            {savedBook.book.cover_url ? (
              <img
                src={savedBook.book.cover_url}
                alt={`Cover of ${savedBook.book.title}`}
                className="w-full aspect-[2/3] object-cover"
              />
            ) : (
              <div className="w-full aspect-[2/3] flex flex-col items-center justify-center p-4 text-center">
                <span className="text-3xl mb-3">
                  📖
                </span>

                <p className="font-['Public_Sans'] text-xs text-[#7C7660]">
                  Cover unavailable
                </p>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="pt-4 px-1">
            <h2 className="font-['Fraunces'] text-base sm:text-lg font-semibold text-[#1B2A22] leading-snug">
              {savedBook.book.title}
            </h2>

            <p className="font-['Public_Sans'] text-sm text-[#5B5646] mt-1">
              {savedBook.book.author}
            </p>

            <div className="mt-3 space-y-1 text-xs sm:text-sm text-[#5B5646] font-['Public_Sans']">
              <p>
                <span className="font-semibold text-[#1B2A22]">
                  Mood:
                </span>{' '}
                {savedBook.mood || 'Not specified'}
              </p>

              <p>
                <span className="font-semibold text-[#1B2A22]">
                  Comfort:
                </span>{' '}
                {savedBook.comfort_level || 'Not specified'}
              </p>
            </div>

            {/* Status */}
            <div className="mt-4">
              <label className="block font-['Courier_Prime'] text-[11px] uppercase tracking-wide text-[#7C7660] mb-1.5">
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
                className="w-full border border-[#B0A67F] bg-[#FFFDF5] px-3 py-2.5 text-xs sm:text-sm text-[#1B2A22] focus:outline-none focus:border-[#21402F]"
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

            {/* Remove */}
            <button
              type="button"
              onClick={() => handleDelete(savedBook.id)}
              className="w-full mt-3 border border-[#8C4A3A] text-[#8C4A3A] py-2.5 text-xs sm:text-sm font-['Courier_Prime'] uppercase tracking-wide hover:bg-[#8C4A3A] hover:text-[#F3ECDA] transition-colors duration-200"
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
