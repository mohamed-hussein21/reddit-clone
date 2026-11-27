import api from './axios';
import { handleApiError } from './auth.api';

// Public list of moderators (users) of a community
export async function getModerators(communityId) {
  const response = await api.get(`/communities/${communityId}/moderators`).catch(handleApiError);
  return response.data;
}

export async function removePost(communityId, postId) {
  const response = await api
    .delete(`/communities/${communityId}/mod/posts/${postId}`)
    .catch(handleApiError);
  return response.data;
}

export async function removeComment(communityId, commentId) {
  const response = await api
    .delete(`/communities/${communityId}/mod/comments/${commentId}`)
    .catch(handleApiError);
  return response.data;
}
