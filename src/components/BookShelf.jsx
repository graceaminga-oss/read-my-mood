function BookShelf({ books }) {
  return (
    <>
      <div>
      <h2>My Bookshelf</h2>
      <p>Here are the books you've added:</p>
      </div>

      <div className="flex gap-4 flex-wrap">
      {books.map((book) => {
        const coverURL = `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`;

        return (
          <div key={book.cover_id}
          className="transition-all duration-300 hover:scale-105 hover:-rotate-2 hover:shadow-lg"
          >
            <img src={coverURL} 
            alt={book.title}
            className="rounded-md" />
            <p>{book.title}</p>
          </div>
        );
      })}
      </div>
    </>
  );
}

export default BookShelf;