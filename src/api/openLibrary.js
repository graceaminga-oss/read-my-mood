function getSearchTermForMood(mood) {
  const moodToSearchTerm = {
    Cozy: 'cottage',
    Adventurous: 'adventure',
    Heartbroken: 'heartbreak',
    Curious: 'mystery',
  };
  return moodToSearchTerm[mood] || 'fiction';
}

export function searchBooks(mood) {
  const searchTerm = getSearchTermForMood(mood);
  // next: actually fetch from Open Library using searchTerm
  const url = `https://openlibrary.org/subjects/${searchTerm}.json?limit=20`;
  return fetch(url).then(res => res.json());
}