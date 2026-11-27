import api from './axios';
import { handleApiError } from './auth.api';

// Tree of comments for a post (each comment has a `replies` array)
export async function getPostComments(postId) {
  const response = await api.get(`/comments/post/${postId}`).catch(handleApiError);
  return response.data;
}

// parentId is only sent for replies
export async function createComment(postId, body, parentId = null) {
  const response = await api.post('/comments', { postId, body, parentId }).catch(handleApiError);
  return response.data;
}

export async function updateComment(commentId, body) {
  const response = await api.patch(`/comments/${commentId}`, { body }).catch(handleApiError);
  return response.data;
}

export async function deleteComment(commentId) {
  const response = await api.delete(`/comments/${commentId}`).catch(handleApiError);
  return response.data;
}
