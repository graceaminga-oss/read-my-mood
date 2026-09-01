function getSearchTermForMood(mood) {
  const moodToSearchTerm = {
    Cozy: 'cozy fiction',
    Adventurous: 'adventure fiction',
    Heartbroken: 'romance heartbreak',
    Curious: 'mystery fiction',
  };

  return moodToSearchTerm[mood] || 'fiction';
}

export async function searchBooks(mood) {
  const searchTerm = getSearchTermForMood(mood);

  const response = await fetch(
    `/api/saved-books/search?mood=${encodeURIComponent(searchTerm)}`,
    {
      credentials: 'include',
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Unable to fetch books.');
  }

  return data;
}