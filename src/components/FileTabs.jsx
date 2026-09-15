/**
 * @file FileTabs.jsx - Horizontal tab bar showing all workspace files.
 *
 * Displays one tab per file with an icon, filename, and (when more than one
 * file is open) a close button.  A "+" button creates a new blank file in
 * the workspace.
 *
 * @license Creative Commons BY-NC-SA 4.0 - Simon Rundell
 */

/** Returns a short icon string for a given filename. */
function fileIcon(filename) {
  if (filename.endsWith('.py'))   return '🐍'
  if (filename.endsWith('.csv'))  return '📊'
  if (filename.endsWith('.json')) return '{}'
  return '📄'
}

/**
 * @param {object}   props
 * @param {object}   props.files         - { [filename]: content }
 * @param {string}   props.activeFile    - Currently selected filename
 * @param {(f:string) => void} props.onSelect  - Switch active file
 * @param {(f:string) => void} props.onRemove  - Remove a file from workspace
 * @param {() => void}          props.onAdd    - Create a new blank file
 */
function FileTabs({ files, activeFile, onSelect, onRemove, onAdd }) {
  const names = Object.keys(files)

  return (
    <div className="file-tabs">
      {names.map((name) => (
        <div
          key={name}
          className={`file-tab${name === activeFile ? ' active' : ''}`}
          onClick={() => onSelect(name)}
          title={name}
        >
          <span className="file-tab-icon" aria-hidden="true">{fileIcon(name)}</span>
          <span className="file-tab-name">{name}</span>
          {names.length > 1 && (
            <button
              className="file-tab-close"
              onClick={(e) => { e.stopPropagation(); onRemove(name) }}
              title={`Remove ${name} from workspace`}
              aria-label={`Remove ${name}`}
            >
              ×
            </button>
          )}
        </div>
      ))}

      <button
        className="file-tab-add"
        onClick={onAdd}
        title="New blank file"
      >
        +
      </button>
    </div>
  )
}

export default FileTabs
