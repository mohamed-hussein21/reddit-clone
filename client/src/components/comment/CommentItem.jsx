import { useState } from 'react';
import { Link } from 'react-router-dom';
import CommentForm from './CommentForm';
import CommentTree from './CommentTree';
import { formatTime } from '../../utils/formatTime';

// One comment with its actions, and its replies under it
export default function CommentItem({ comment, actions }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mode, setMode] = useState(null); // null | 'reply' | 'edit'

  const { user, isModerator, onReply, onEdit, onDelete, onRemove } = actions;

  const isGone = comment.isDeleted || comment.isRemoved;
  const isMine = !isGone && user && comment.author?._id === user._id;
  const replyCount = comment.replies?.length || 0;

  async function handleReply(body) {
    await onReply(comment, body);
    setMode(null);
  }

  async function handleEdit(body) {
    await onEdit(comment, body);
    setMode(null);
  }

  return (
    <li className="comment">
      <div className="comment-header">
        <button
          type="button"
          className="comment-collapse"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand thread' : 'Collapse thread'}
        >
          {collapsed ? '[+]' : '[–]'}
        </button>

        {comment.author ? (
          <Link to={`/user/${comment.author.username}`} className="comment-author">
            u/{comment.author.username}
          </Link>
        ) : (
          <span className="comment-author muted">{comment.body}</span>
        )}

        <span className="muted">· {formatTime(comment.createdAt)}</span>
        {comment.isEdited && !isGone && <span className="muted">· edited</span>}
        {collapsed && replyCount > 0 && (
          <span className="muted">
            · {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
          </span>
        )}
      </div>

      {!collapsed && (
        <div className="comment-content">
          {mode === 'edit' ? (
            <CommentForm
              initialValue={comment.body}
              submitLabel="Save"
              onSubmit={handleEdit}
              onCancel={() => setMode(null)}
              autoFocus
            />
          ) : (
            <p className={isGone ? 'comment-body muted' : 'comment-body'}>{comment.body}</p>
          )}

          {!isGone && mode === null && (
            <div className="comment-actions">
              {user && (
                <button type="button" onClick={() => setMode('reply')}>
                  Reply
                </button>
              )}
              {isMine && (
                <>
                  <button type="button" onClick={() => setMode('edit')}>
                    Edit
                  </button>
                  <button type="button" onClick={() => onDelete(comment)}>
                    Delete
                  </button>
                </>
              )}
              {isModerator && (
                <button type="button" className="danger" onClick={() => onRemove(comment)}>
                  Remove
                </button>
              )}
            </div>
          )}

          {mode === 'reply' && (
            <CommentForm
              submitLabel="Reply"
              placeholder={`Reply to u/${comment.author?.username}`}
              onSubmit={handleReply}
              onCancel={() => setMode(null)}
              autoFocus
            />
          )}

          <CommentTree comments={comment.replies} actions={actions} />
        </div>
      )}
    </li>
  );
}
