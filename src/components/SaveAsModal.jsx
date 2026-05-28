/**
 * @file SaveAsModal.jsx - Modal dialog for naming a file before saving.
 * @license Creative Commons BY-NC-SA 4.0 - Simon Rundell
 */
import { useState, useEffect, useRef } from 'react'

/**
 * @param {object}   props
 * @param {string}   props.initialName - Pre-filled filename.
 * @param {(name: string) => void} props.onSave - Called with the final filename.
 * @param {() => void} props.onClose - Called on cancel or backdrop click.
 * @param {string}   [props.hint] - Optional explanatory note shown below the field.
 */
function SaveAsModal({ initialName, onSave, onClose, hint = '' }) {
  const [name, setName] = useState(initialName)
  const inputRef = useRef(null)

  useEffect(() => {
    // Select the stem (before .py) so the user can type straight away
    const el = inputRef.current
    if (!el) return
    el.focus()
    const dot = el.value.lastIndexOf('.')
    el.setSelectionRange(0, dot > 0 ? dot : el.value.length)
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    onSave(name.trim() || initialName)
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-save-as" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>💾 Save As</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          <div className="save-as-field">
            <label htmlFor="save-filename">Filename</label>
            <input
              ref={inputRef}
              id="save-filename"
              type="text"
              className="save-as-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              spellCheck={false}
            />
          </div>

          {hint && <p className="save-as-hint">{hint}</p>}

          <div className="save-as-actions">
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-run">
              💾 Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SaveAsModal
