function BookShelf({ books }) {
  return (
    <>
      <div className="mt-10">
      <h2 className="text-2xl font-bold text-stone-800 mb-2">My Bookshelf</h2>
      <p className="text-lg text-gray-500 mb-8">Here are the books you've added:</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {books.map((book) => {
        const coverURL = `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`;

        return (
          <div key={book.cover_id}
          className="transition-all duration-300 hover:scale-105 hover:-rotate-2 hover:shadow-lg"
          >
            <img src={coverURL} 
            alt={book.title}
            className="w-24 md:w-32 h-auto rounded-md" />
            <p className="text-sm text-gray-600 mt-1">{book.title}</p>
          </div>
        );
      })}
      </div>
    </>
  );
}

export default BookShelf;