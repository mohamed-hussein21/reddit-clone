import api from './axios';
import { handleApiError } from './auth.api';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function getProfile(username) {
  const response = await api.get(
    '/users/' + encodeURIComponent(username)
  ).catch(handleApiError);

  return response.data;
}

export async function updateProfile(displayName, bio) {
  const response = await api.patch('/users/me', {
    displayName,
    bio
  }).catch(handleApiError);

  return response.data;
}

export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await api.post('/users/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).catch(handleApiError);

  return response.data;
}

export async function getUserPosts(username) {
  const response = await api.get(
    '/users/' + encodeURIComponent(username) + '/posts'
  ).catch(handleApiError);

  return response.data;
}

export async function getUserComments(username) {
  const response = await api.get(
    '/users/' + encodeURIComponent(username) + '/comments'
  ).catch(handleApiError);

  return response.data;
}

export function imageUrl(path) {
  if (!path) {
    return '';
  }

  return new URL(path, API_URL).href;
}