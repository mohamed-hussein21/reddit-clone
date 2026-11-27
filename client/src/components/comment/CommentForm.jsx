import { useState } from 'react';

// Textarea used for a new comment, a reply, and editing
export default function CommentForm({
  initialValue = '',
  submitLabel = 'Comment',
  placeholder = 'What are your thoughts?',
  onSubmit,
  onCancel,
  autoFocus = false,
}) {
  const [body, setBody] = useState(initialValue);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!body.trim()) return;

    setSending(true);
    setError('');

    try {
      await onSubmit(body.trim());
      setBody('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        maxLength={10000}
        autoFocus={autoFocus}
        rows={3}
      />

      {error && <p className="comment-error">{error}</p>}

      <div className="comment-form-actions">
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={sending || !body.trim()}>
          {sending ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
