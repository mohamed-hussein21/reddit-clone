import api from './axios';
import { handleApiError } from './auth.api';

// Returns { summary, cached }
export async function summarizePost(postId) {
  const response = await api.post(`/posts/${postId}/summary`).catch(handleApiError);
  return response.data;
}
