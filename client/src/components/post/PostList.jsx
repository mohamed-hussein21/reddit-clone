import { Link, useSearchParams } from 'react-router-dom';
import { BsArrowUp, BsChatLeft } from 'react-icons/bs';
import { useInfinitePosts } from '../../hooks/useInfinitePosts';
import { SORT_OPTIONS } from '../../utils/constants';
import { formatTime } from '../../utils/formatTime';
import SortBar from './SortBar';
import InfiniteScroll from '../common/InfiniteScroll';
import '../../styles/feed.css';

// TEMPORARY card until Omar's <PostCard /> is ready.
// When it is ready: delete this function, import PostCard,
// and replace <PostPreview post={post} /> with <PostCard post={post} />
function PostPreview({ post }) {
  return (
    <article className="post-preview">
      <div className="post-preview-score">
        <BsArrowUp />
        <span>{post.score}</span>
      </div>

      <div className="post-preview-content">
        <p className="post-preview-meta">
          <Link to={`/r/${post.community?.name}`} className="post-preview-community">
            r/{post.community?.name}
          </Link>
          {' • Posted by '}
          <Link to={`/user/${post.author?.username}`}>u/{post.author?.username}</Link>
          {' • '}
          {formatTime(post.createdAt)}
        </p>

        <Link to={`/r/${post.community?.name}/comments/${post._id}`}>
          <h3 className="post-preview-title">{post.title}</h3>
        </Link>

        <p className="post-preview-comments">
          <BsChatLeft /> {post.commentsCount} comments
        </p>
      </div>
    </article>
  );
}

// The feed: sort buttons + posts + infinite scroll.
// type: 'home' | 'popular' | 'community'  (communityName is needed for 'community')
export default function PostList({ type, communityName, emptyMessage = 'No posts yet' }) {
  // Keep the sort in the URL (?sort=top) so refresh / sharing keeps it
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = SORT_OPTIONS.includes(searchParams.get('sort')) ? searchParams.get('sort') : 'new';

  const { posts, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfinitePosts({ type, communityName, sort });

  const changeSort = (value) => {
    setSearchParams(value === 'new' ? {} : { sort: value });
  };

  return (
    <section className="post-list">
      <SortBar sort={sort} onChange={changeSort} />

      {isLoading && <p className="feed-status">Loading posts...</p>}

      {isError && <p className="feed-status feed-error">{error.message}</p>}

      {!isLoading && !isError && posts.length === 0 && (
        <p className="feed-status">{emptyMessage}</p>
      )}

      <InfiniteScroll
        onLoadMore={fetchNextPage}
        hasMore={Boolean(hasNextPage)}
        loading={isFetchingNextPage}
      >
        {posts.map((post) => (
          <PostPreview key={post._id} post={post} />
        ))}
      </InfiniteScroll>

      {isFetchingNextPage && <p className="feed-status">Loading more...</p>}

      {!hasNextPage && posts.length > 0 && (
        <p className="feed-status">You have reached the end 🎉</p>
      )}
    </section>
  );
}