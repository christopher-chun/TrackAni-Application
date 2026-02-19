const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to make authenticated requests
const authFetch = async (endpoint, options = {}, getToken) => {
  const token = await getToken();
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Something went wrong');
  }
  return response.json();
};

// Favorites API
export const getFavorites = (getToken) => 
  authFetch('/favorites', {}, getToken);
export const addFavorite = (getToken, itemId, itemType) =>
  authFetch('/favorites', {
    method: 'POST',
    body: JSON.stringify({ itemId, itemType })
  }, getToken);
export const removeFavorite = (getToken, itemId, itemType) =>
  authFetch(`/favorites/${itemId}/${itemType}`, {
    method: 'DELETE'
  }, getToken);
export const checkFavorite = (getToken, itemId, itemType) =>
  authFetch(`/favorites/check/${itemId}/${itemType}`, {}, getToken);

// List API
export const getList = (getToken, itemType = null, status = null) => {
  const params = new URLSearchParams();
  if (itemType) params.append('itemType', itemType);
  if (status) params.append('status', status);
  const query = params.toString() ? `?${params.toString()}` : '';
  return authFetch(`/list${query}`, {}, getToken);
};
export const getListItem = (getToken, itemId, itemType) =>
  authFetch(`/list/${itemId}/${itemType}`, {}, getToken);
export const addToList = (getToken, itemId, itemType, status) =>
  authFetch('/list', {
    method: 'POST',
    body: JSON.stringify({ itemId, itemType, status })
  }, getToken);
export const updateListItem = (getToken, itemId, itemType, updateData) =>
  authFetch(`/list/${itemId}/${itemType}`, {
    method: 'PATCH',
    body: JSON.stringify(updateData)
  }, getToken);
export const removeFromList = (getToken, itemId, itemType) =>
  authFetch(`/list/${itemId}/${itemType}`, {
    method: 'DELETE'
  }, getToken);
export const getListStats = (getToken, itemType) =>
  authFetch(`/list/stats/${itemType}`, {}, getToken);