const API_BASE_URL = 'https://read-my-mood.onrender.com/api';

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong.');
  }

  return data;
}


// -------------------------
// Authentication
// -------------------------

export async function signup(name, email, password) {
  return request('/signup', {
    method: 'POST',
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
}


export async function login(email, password) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  });
}


export async function logout() {
  return request('/logout', {
    method: 'POST',
  });
}


export async function getCurrentUser() {
  return request('/me');
}


// -------------------------
// Saved books
// -------------------------

export async function getSavedBooks(page = 1, perPage = 10) {
  return request(
    `/saved-books?page=${page}&per_page=${perPage}`
  );
}


export async function getSavedBook(savedBookId) {
  return request(`/saved-books/${savedBookId}`);
}


export async function saveBook(book) {
  return request('/saved-books', {
    method: 'POST',
    body: JSON.stringify(book),
  });
}


export async function updateSavedBook(savedBookId, updates) {
  return request(`/saved-books/${savedBookId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}


export async function deleteSavedBook(savedBookId) {
  return request(`/saved-books/${savedBookId}`, {
    method: 'DELETE',
  });
}


// -------------------------
// Mood check-ins
// -------------------------

export async function getMoodCheckIns(page = 1, perPage = 10) {
  return request(
    `/mood-checkins?page=${page}&per_page=${perPage}`
  );
}


export async function getMoodCheckIn(checkinId) {
  return request(`/mood-checkins/${checkinId}`);
}


export async function createMoodCheckIn(checkIn) {
  return request('/mood-checkins', {
    method: 'POST',
    body: JSON.stringify(checkIn),
  });
}


export async function updateMoodCheckIn(checkinId, updates) {
  return request(`/mood-checkins/${checkinId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}


export async function deleteMoodCheckIn(checkinId) {
  return request(`/mood-checkins/${checkinId}`, {
    method: 'DELETE',
  });
}