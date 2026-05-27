/**
 * @file LibraryManager.jsx - Modal dialog for installing Python packages.
 *
 * Shows a curated list of packages grouped by category.  Installed packages
 * are ticked; clicking Install triggers pyodide.loadPackage() via the hook.
 *
 * @license Creative Commons BY-NC-SA 4.0 - Simon Rundell
 */
import { useState } from 'react'
import { CURATED_PACKAGES, CATEGORIES } from '../utils/packages'

/**
 * @param {object} props
 * @param {() => void}      props.onClose
 * @param {Set<string>}     props.installedPackages
 * @param {(id: string) => Promise<void>} props.onInstall
 * @param {string|null}     props.installing  - package id currently being installed
 */
function LibraryManager({ onClose, installedPackages, onInstall, installing }) {
  const [error, setError] = useState(null)
  const [justInstalled, setJustInstalled] = useState(new Set())

  async function handleInstall(pkg) {
    setError(null)
    try {
      await onInstall(pkg.id)
      setJustInstalled((prev) => new Set([...prev, pkg.id]))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📦 Install Packages</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <p className="modal-intro">
          Tick the packages your program needs — this is like running{' '}
          <code>pip install</code>. Packages are downloaded once per session.
        </p>
        <p className="modal-intro note">
          <strong>Turtle graphics</strong> is always available — just{' '}
          <code>import turtle</code>. No installation needed.
        </p>

        {error && <div className="install-error">{error}</div>}

        {CATEGORIES.map((cat) => {
          const pkgs = CURATED_PACKAGES.filter((p) => p.category === cat)
          if (!pkgs.length) return null
          return (
            <div key={cat} className="pkg-category">
              <h3>{cat}</h3>
              <div className="pkg-list">
                {pkgs.map((pkg) => {
                  const installed = installedPackages.has(pkg.id) || justInstalled.has(pkg.id)
                  const busy = installing === pkg.id
                  return (
                    <div key={pkg.id} className={`pkg-row ${installed ? 'installed' : ''}`}>
                      <div className="pkg-info">
                        <span className="pkg-name">{pkg.name}</span>
                        <span className="pkg-desc">{pkg.description}</span>
                      </div>
                      <button
                        className={`btn btn-install ${installed ? 'installed' : ''}`}
                        onClick={() => !installed && !busy && handleInstall(pkg)}
                        disabled={installed || busy || installing !== null}
                      >
                        {busy ? 'Installing…' : installed ? '✓ Installed' : 'Install'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LibraryManager
