import api from './axios';

export function handleApiError(error) {
  throw new Error(error.response?.data?.message || error.message);
}

export async function register(username, email, password) {
  const response = await api.post('/auth/register', {
    username,
    email,
    password
  }).catch(handleApiError);

  return response.data;
}

export async function login(email, password) {
  const response = await api.post('/auth/login', {
    email,
    password
  }).catch(handleApiError);

  return response.data;
}

export async function logout() {
  const response = await api.post('/auth/logout')
    .catch(handleApiError);

  return response.data;
}

export async function getMe() {
  const response = await api.get('/auth/me')
    .catch(handleApiError);

  return response.data;
}