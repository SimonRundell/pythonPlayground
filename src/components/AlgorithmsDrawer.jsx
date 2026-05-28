/**
 * @file AlgorithmsDrawer.jsx - Sliding right-side drawer and full-detail algorithm modal.
 *
 * Content is drawn from "The Little Book of Algorithms 2.0" by William Lau,
 * used under Creative Commons BY-NC-SA 4.0.
 * Original work © William Lau. Adapted for Python Playground by Simon Rundell.
 *
 * @license Creative Commons BY-NC-SA 4.0 - Simon Rundell
 */
import { useState, useMemo } from 'react'
import { ALGORITHMS, ALGORITHM_CATEGORIES } from '../utils/algorithms'

/** Maps each category name to a distinctive colour. */
const CATEGORY_COLOURS = {
  'Maths':          '#06b6d4',
  'Strings':        '#8b5cf6',
  'Iteration':      '#f97316',
  'Selection':      '#3b82f6',
  'Lists':          '#22c55e',
  'Searching':      '#64748b',
  'Number Systems': '#ec4899',
  'Files':          '#eab308',
}

// ── Detail modal ──────────────────────────────────────────────────────────────

/**
 * Full-screen modal showing all content for a single algorithm.
 * @param {object}   props
 * @param {object}   props.algo
 * @param {(code: string) => void} props.onLoadCode
 * @param {() => void} props.onClose
 */
function AlgoDetailModal({ algo, onLoadCode, onClose }) {
  const colour = CATEGORY_COLOURS[algo.category] ?? '#64748b'

  function loadAndClose(code) {
    onLoadCode(code)
    onClose()
  }

  return (
    <div className="modal-overlay algo-detail-overlay" onClick={onClose}>
      <div className="modal modal-algo-detail" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header algo-detail-header">
          <div className="algo-detail-title-group">
            <span className="algo-badge" style={{ background: colour }}>
              {algo.category}
            </span>
            <h2 className="algo-detail-title">{algo.title}</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Content — modal itself scrolls via base .modal overflow-y:auto */}
        <div className="algo-detail-content">
          <p className="algo-detail-desc">{algo.description}</p>

          {/* Teaching notes */}
          {algo.teachingNotes.length > 0 && (
            <div className="algo-detail-section">
              <h3 className="algo-detail-section-heading">Teaching Notes</h3>
              <ul className="algo-detail-notes">
                {algo.teachingNotes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Example code */}
          <div className="algo-detail-section">
            <div className="algo-detail-code-header">
              <h3 className="algo-detail-section-heading">Example Code</h3>
              <button
                className="btn btn-load-code"
                onClick={() => loadAndClose(algo.code)}
              >
                Load into Editor →
              </button>
            </div>
            <pre className="algo-code">{algo.code}</pre>
          </div>

          {/* Challenges */}
          {algo.challenges.length > 0 && (
            <div className="algo-detail-section">
              <h3 className="algo-detail-section-heading">Challenges</h3>
              {algo.challenges.map((ch) => (
                <div key={ch.id} className="algo-detail-challenge">
                  <div className="algo-detail-challenge-header">
                    <span className="challenge-title">🎯 {ch.title}</span>
                    {ch.code && (
                      <button
                        className="btn btn-load-starter"
                        onClick={() => loadAndClose(ch.code)}
                      >
                        Load Starter Code →
                      </button>
                    )}
                  </div>
                  <p className="challenge-desc">{ch.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Attribution */}
          <footer className="algo-detail-footer">
            Content from <em>The Little Book of Algorithms 2.0</em> by{' '}
            <strong>William Lau</strong>, used under{' '}
            <a
              href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CC BY-NC-SA 4.0
            </a>.
          </footer>
        </div>
      </div>
    </div>
  )
}

// ── List row ──────────────────────────────────────────────────────────────────

/**
 * Simple clickable row in the algorithm list.
 * @param {object}   props
 * @param {object}   props.algo
 * @param {() => void} props.onSelect
 */
function AlgoListItem({ algo, onSelect }) {
  const colour = CATEGORY_COLOURS[algo.category] ?? '#64748b'
  return (
    <div
      className="algo-list-item"
      onClick={onSelect}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      role="button"
      tabIndex={0}
      aria-label={`View ${algo.title}`}
    >
      <span className="algo-title">{algo.title}</span>
      <span className="algo-badge" style={{ background: colour }}>
        {algo.category}
      </span>
      <span className="algo-list-chevron" aria-hidden="true">›</span>
    </div>
  )
}

// ── Main drawer ───────────────────────────────────────────────────────────────

/**
 * Right-side sliding drawer containing the searchable algorithm index.
 * @param {object}   props
 * @param {boolean}  props.isOpen
 * @param {() => void} props.onClose
 * @param {(code: string) => void} props.onLoadCode
 */
function AlgorithmsDrawer({ isOpen, onClose, onLoadCode }) {
  const [search, setSearch]               = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [selectedAlgo, setSelectedAlgo]   = useState(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return ALGORITHMS
      .filter((algo) => {
        const matchCat  = !activeCategory || algo.category === activeCategory
        const matchText = !q ||
          algo.title.toLowerCase().includes(q) ||
          algo.description.toLowerCase().includes(q) ||
          algo.teachingNotes.some((n) => n.toLowerCase().includes(q))
        return matchCat && matchText
      })
      .sort((a, b) => {
        const ai = ALGORITHM_CATEGORIES.indexOf(a.category)
        const bi = ALGORITHM_CATEGORIES.indexOf(b.category)
        return ai !== bi ? ai - bi : a.id - b.id
      })
  }, [search, activeCategory])

  function toggleCategory(cat) {
    setActiveCategory((prev) => (prev === cat ? null : cat))
  }

  return (
    <>
      {isOpen && (
        <div className="drawer-backdrop" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        className={`algorithms-drawer${isOpen ? ' open' : ''}`}
        aria-label="Algorithms reference drawer"
        aria-hidden={!isOpen}
      >
        {/* ── Header ── */}
        <div className="drawer-header">
          <div className="drawer-title-row">
            <h2>📚 Algorithms</h2>
            <button className="modal-close" onClick={onClose} aria-label="Close drawer">✕</button>
          </div>

          <p className="drawer-subtitle">
            From <em>The Little Book of Algorithms 2.0</em> by William Lau
          </p>

          <input
            type="search"
            className="drawer-search"
            placeholder="Search algorithms…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search algorithms"
          />

          <div className="category-chips" role="group" aria-label="Filter by category">
            <button
              className={`chip${!activeCategory ? ' chip-active' : ''}`}
              onClick={() => setActiveCategory(null)}
            >
              All
            </button>
            {ALGORITHM_CATEGORIES.map((cat) => {
              const active = activeCategory === cat
              return (
                <button
                  key={cat}
                  className={`chip${active ? ' chip-active' : ''}`}
                  style={active
                    ? { background: CATEGORY_COLOURS[cat], borderColor: CATEGORY_COLOURS[cat], color: '#fff' }
                    : {}}
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Algorithm list ── */}
        <div className="drawer-body">
          {filtered.length === 0 ? (
            <p className="drawer-empty">No algorithms match your search.</p>
          ) : (
            filtered.map((algo) => (
              <AlgoListItem
                key={algo.id}
                algo={algo}
                onSelect={() => setSelectedAlgo(algo)}
              />
            ))
          )}
        </div>

        {/* ── Footer ── */}
        <footer className="drawer-footer">
          <p>
            Content from <strong>The Little Book of Algorithms 2.0</strong>{' '}
            by <strong>William Lau</strong>, used under{' '}
            <a
              href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CC BY-NC-SA 4.0
            </a>.
          </p>
          <p>Python Playground © 2026 Simon Rundell — CC BY-NC-SA 4.0</p>
        </footer>
      </aside>

      {/* ── Detail modal (rendered outside the drawer so it overlays everything) ── */}
      {selectedAlgo && (
        <AlgoDetailModal
          algo={selectedAlgo}
          onLoadCode={onLoadCode}
          onClose={() => setSelectedAlgo(null)}
        />
      )}
    </>
  )
}

export default AlgorithmsDrawer
