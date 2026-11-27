import { useEffect } from 'react';
import '../../styles/dialog.css';

// Small "Are you sure?" popup. Renders nothing when open is false.
export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
}) {
  // Close with the Escape key
  useEffect(() => {
    if (!open) return;

    function handleKey(e) {
      if (e.key === 'Escape') onCancel();
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        {message && <p>{message}</p>}

        <div className="dialog-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
