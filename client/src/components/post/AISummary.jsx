import { useState } from 'react';
import { HiSparkles } from 'react-icons/hi2';
import { useAuth } from '../../hooks/useAuth';
import { summarizePost } from '../../api/ai.api';
import '../../styles/feed.css';

// "Summarize with AI" button + the summary box.
// Usage in PostDetails:  <AISummary postId={post._id} />
export default function AISummary({ postId }) {
  const { user } = useAuth();

  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await summarizePost(postId);
      setSummary(data.summary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // The endpoint needs login
  if (!user) {
    return <p className="ai-summary-hint">Log in to summarize this post with AI.</p>;
  }

  return (
    <div className="ai-summary">
      {!summary && (
        <button
          type="button"
          className="ai-summary-btn"
          onClick={handleSummarize}
          disabled={loading}
        >
          <HiSparkles /> {loading ? 'Summarizing...' : 'Summarize with AI'}
        </button>
      )}

      {error && <p className="ai-summary-error">{error}</p>}

      {summary && (
        <div className="ai-summary-box">
          <p className="ai-summary-label">
            <HiSparkles /> AI summary
          </p>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
