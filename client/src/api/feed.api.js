import api from './axios';
import { handleApiError } from './auth.api';

// type: 'home' | 'popular' | 'community'
const feedUrl = (type, communityName) => {
  if (type === 'home') return '/posts/feed';
  if (type === 'community') return `/communities/${communityName}/posts`;
  return '/posts/popular';
};

// Returns { posts, page, limit, total, totalPages, hasMore }
export async function getFeed({ type, communityName, sort = 'new', page = 1, limit = 10 }) {
  const response = await api
    .get(feedUrl(type, communityName), { params: { sort, page, limit } })
    .catch(handleApiError);

  return response.data;
}