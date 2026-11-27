import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import * as commentsApi from '../../api/comments.api';
import * as moderationApi from '../../api/moderation.api';
import CommentForm from './CommentForm';
import CommentTree from './CommentTree';
import ConfirmDialog from '../common/ConfirmDialog';
import '../../styles/comments.css';

// Everything about comments for one post: the form, the tree,
// and the delete / remove confirmation.
// Usage in PostDetails:  <CommentSection postId={post._id} communityId={post.community._id} />
export default function CommentSection({ postId, communityId }) {
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [moderators, setModerators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(null); // { type: 'delete' | 'remove', comment }

  // Reloads the tree after any change (new comment, edit, delete...)
  const loadComments = useCallback(async () => {
    try {
      setComments(await commentsApi.getPostComments(postId));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, [postId]);

  // First load when the post opens
  useEffect(() => {
    let ignore = false; // stops a slow old request from overwriting a new post

    commentsApi
      .getPostComments(postId)
      .then((data) => !ignore && setComments(data))
      .catch((err) => !ignore && setError(err.message))
      .finally(() => !ignore && setLoading(false));

    return () => {
      ignore = true;
    };
  }, [postId]);

  // Who can see the Remove button
  useEffect(() => {
    if (!communityId) return;

    moderationApi
      .getModerators(communityId)
      .then(setModerators)
      .catch(() => setModerators([]));
  }, [communityId]);

  const isModerator = Boolean(user && moderators.some((mod) => mod._id === user._id));

  async function handleCreate(body) {
    await commentsApi.createComment(postId, body);
    await loadComments();
  }

  async function handleReply(parent, body) {
    await commentsApi.createComment(postId, body, parent._id);
    await loadComments();
  }

  async function handleEdit(comment, body) {
    await commentsApi.updateComment(comment._id, body);
    await loadComments();
  }

  async function handleConfirm() {
    const { type, comment } = confirm;
    setConfirm(null);

    try {
      if (type === 'delete') {
        await commentsApi.deleteComment(comment._id);
      } else {
        await moderationApi.removeComment(communityId, comment._id);
      }

      await loadComments();
    } catch (err) {
      toast.error(err.message);
    }
  }

  const actions = {
    user,
    isModerator,
    onReply: handleReply,
    onEdit: handleEdit,
    onDelete: (comment) => setConfirm({ type: 'delete', comment }),
    onRemove: (comment) => setConfirm({ type: 'remove', comment }),
  };

  return (
    <section className="comment-section">
      {user ? (
        <CommentForm onSubmit={handleCreate} />
      ) : (
        <p className="muted">
          <Link to="/login">Log in</Link> to join the conversation.
        </p>
      )}

      {loading && <p className="muted">Loading comments...</p>}
      {error && <p className="comment-error">{error}</p>}
      {!loading && !error && comments.length === 0 && (
        <p className="muted">No comments yet. Be the first to share what you think!</p>
      )}

      <CommentTree comments={comments} actions={actions} />

      <ConfirmDialog
        open={confirm !== null}
        title={confirm?.type === 'remove' ? 'Remove comment?' : 'Delete comment?'}
        message={
          confirm?.type === 'remove'
            ? 'It will show as [removed] for everyone. Replies will stay.'
            : 'It will show as [deleted]. Replies will stay.'
        }
        confirmLabel={confirm?.type === 'remove' ? 'Remove' : 'Delete'}
        onConfirm={handleConfirm}
        onCancel={() => setConfirm(null)}
      />
    </section>
  );
}
