function getSearchTermForMood(mood) {
  const moodToSearchTerm = {
    Cozy: 'holidays',
    Adventurous: 'adventure',
    Heartbroken: 'heartbreak',
    Curious: 'mystery',
  };

  return moodToSearchTerm[mood] || 'fiction';
}

export async function searchBooks(mood) {
  const searchTerm = getSearchTermForMood(mood);

  const url =
    `https://openlibrary.org/search.json` +
    `?subject=${encodeURIComponent(searchTerm)}` +
    `&limit=40` +
    `&fields=key,title,author_name,cover_i`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Open Library request failed: ${response.status}`);
  }

  const data = await response.json();

  const books = (data.docs || [])
    .filter((book) => book.cover_i)
    .map((book) => ({
      key: book.key,
      title: book.title,
      cover_id: book.cover_i,
      authors: (book.author_name || []).map((name) => ({
        name,
      })),
    }));

  return {
    works: books,
  };
}
