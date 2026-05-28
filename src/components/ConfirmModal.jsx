/**
 * @file ConfirmModal.jsx - Generic confirmation dialog.
 * @license Creative Commons BY-NC-SA 4.0 - Simon Rundell
 */

/**
 * @param {object}   props
 * @param {string}   props.title
 * @param {string}   props.message
 * @param {string}   [props.confirmLabel]
 * @param {string}   [props.cancelLabel]
 * @param {string}   [props.confirmClass]   - extra CSS class on the confirm button
 * @param {() => void} props.onConfirm
 * @param {() => void} props.onClose
 */
function ConfirmModal({
  title,
  message,
  confirmLabel = 'OK',
  cancelLabel  = 'Cancel',
  confirmClass = '',
  onConfirm,
  onClose,
}) {
  function handleKeyDown(e) {
    if (e.key === 'Escape') onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose} onKeyDown={handleKeyDown}>
      <div className="modal modal-confirm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <p className="confirm-message">{message}</p>

        <div className="confirm-actions">
          <button className="btn btn-cancel" onClick={onClose}>
            {cancelLabel}
          </button>
          <button
            className={`btn ${confirmClass}`}
            onClick={() => { onConfirm(); onClose() }}
            autoFocus
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
