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
 * @param {() => void}  props.onReset
 * @param {boolean}     props.isRunning
 * @param {string|null} props.installing  - package id currently being installed
 * @param {boolean}     props.pyodideLoaded
 * @param {string}      props.loadingMessage
 */
function Toolbar({ onRun, onLoad, onSave, onPackages, onAlgorithms, onReset, isRunning, installing, pyodideLoaded, loadingMessage }) {
  return (
    <div className="toolbar">
      <button
        className="btn btn-run"
        onClick={onRun}
        disabled={!pyodideLoaded || isRunning || !!installing}
        title={installing ? `Waiting for package install…` : 'Run code (Ctrl+Enter)'}
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
        className="btn btn-reset"
        onClick={onReset}
        disabled={isRunning}
        title="Reset code and uninstall packages"
      >
        🔄 Reset
      </button>

      <button
        className="btn btn-algorithms"
        onClick={onAlgorithms}
        title="Open algorithm challenges inspired by William Lau"
      >
        📚 Algorithm Challenges
      </button>

      {!pyodideLoaded && (
        <span className="loading-message">{loadingMessage}</span>
      )}
      {pyodideLoaded && installing && (
        <span className="loading-message">⬇ Installing {installing}…</span>
      )}
    </div>
  )
}

export default Toolbar
