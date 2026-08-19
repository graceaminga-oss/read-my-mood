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
  const url = `https://openlibrary.org/subjects/${searchTerm}.json?limit=20`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Open Library request failed: ${response.status}`);
  }

  const data = await response.json();
  return data;
}
