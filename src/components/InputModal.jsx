/**
 * @file InputModal.jsx - Modal dialog for Python's input() function.
 *
 * Replaces the browser's native prompt() dialog with a styled modal.
 * The prompt text supplied by the Python program is displayed as the label.
 *
 * @license Creative Commons BY-NC-SA 4.0 - Simon Rundell
 */
import { useState, useEffect, useRef } from 'react'

/**
 * @param {object}   props
 * @param {string}   props.prompt    - The prompt string passed to input()
 * @param {(value: string) => void} props.onSubmit
 * @param {() => void} props.onCancel - Called on Escape or Cancel; submits ''
 */
function InputModal({ prompt, onSubmit, onCancel }) {
  const [value, setValue] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(value)
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal modal-input" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⌨️ Input Required</h2>
          <button className="modal-close" onClick={onCancel}>✕</button>
        </div>

        <form onSubmit={handleSubmit} onKeyDown={(e) => e.key === 'Escape' && onCancel()}>
          <div className="save-as-field">
            <label className="input-modal-prompt">
              {prompt || 'Enter a value:'}
            </label>
            <input
              ref={inputRef}
              type="text"
              className="save-as-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <div className="save-as-actions">
            <button type="button" className="btn btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-run">
              OK
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default InputModal
