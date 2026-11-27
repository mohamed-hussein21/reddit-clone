import PostList from '../components/post/PostList';
import '../styles/feed.css';

// Popular: posts from all public communities
export default function Popular() {
  return (
    <div className="feed-page">
      <div className="feed-main">
        <h2 className="feed-title">Popular</h2>
        <PostList type="popular" />
      </div>
    </div>
  );
}