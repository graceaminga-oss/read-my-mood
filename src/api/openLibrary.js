const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://read-my-mood.onrender.com/api';

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

  const response = await fetch(
    `${API_BASE_URL}/saved-books/search?mood=${encodeURIComponent(searchTerm)}`,
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