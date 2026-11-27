import { useInfiniteQuery } from '@tanstack/react-query';
import { getFeed } from '../api/feed.api';
import { PAGE_SIZE } from '../utils/constants';

// Loads posts page by page for the home / popular / community feeds.
// React Query keeps every loaded page, and caches them per feed + sort.
export function useInfinitePosts({ type, communityName, sort }) {
  const query = useInfiniteQuery({
    queryKey: ['posts', type, communityName, sort],
    queryFn: ({ pageParam }) =>
      getFeed({ type, communityName, sort, page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    // The backend tells us if there is another page
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
  });

  // pages = [{ posts: [...] }, { posts: [...] }] -> one flat list
  const posts = query.data?.pages.flatMap((page) => page.posts) ?? [];

  return { ...query, posts };
}
