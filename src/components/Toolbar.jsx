/**
 * @file Toolbar.jsx - Top action bar with Run, Load, Save, Packages and Algorithms buttons.
 * @license Creative Commons BY-NC-SA 4.0 - Simon Rundell
 */

/**
 * @param {object} props
 * @param {() => void}  props.onRun
 * @param {() => void}  props.onLoad
 * @param {() => void}  props.onSave
 * @param {() => void}  props.onPackages
 * @param {() => void}  props.onAlgorithms
 * @param {boolean}     props.isRunning
 * @param {boolean}     props.pyodideLoaded
 * @param {string}      props.loadingMessage
 */
function Toolbar({ onRun, onLoad, onSave, onPackages, onAlgorithms, isRunning, pyodideLoaded, loadingMessage }) {
  return (
    <div className="toolbar">
      <button
        className="btn btn-run"
        onClick={onRun}
        disabled={!pyodideLoaded || isRunning}
        title="Run code (Ctrl+Enter)"
      >
        {isRunning ? '⏳ Running…' : '▶ Run'}
      </button>

      <button
        className="btn btn-secondary"
        onClick={onLoad}
        disabled={isRunning}
        title="Load a .py file"
      >
        📂 Load
      </button>

      <button
        className="btn btn-secondary"
        onClick={onSave}
        title="Save as .py file"
      >
        💾 Save
      </button>

      <button
        className="btn btn-packages"
        onClick={onPackages}
        title="Install Python packages"
      >
        📦 Packages
      </button>

      <button
        className="btn btn-algorithms"
        onClick={onAlgorithms}
        title="Open algorithms reference"
      >
        📚 Algorithms
      </button>

      {!pyodideLoaded && (
        <span className="loading-message">{loadingMessage}</span>
      )}
    </div>
  )
}

export default Toolbar
