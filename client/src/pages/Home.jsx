import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PostList from '../components/post/PostList';
import RightSidebar from '../components/layout/RightSidebar';
import '../styles/feed.css';

// Home: posts from the communities the user joined.
// Guests (not logged in) see popular posts instead, like on reddit.
export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <div className="feed-page">
      <div className="feed-main">
        {user ? (
          <PostList
            type="home"
            emptyMessage="Your feed is empty. Join some communities to see their posts here!"
          />
        ) : (
          <>
            <div className="feed-banner">
              <Link to="/login">Log in</Link> to see posts from your communities. Showing popular posts for now.
            </div>
            <PostList type="popular" />
          </>
        )}
      </div>

      <RightSidebar />
    </div>
  );
}