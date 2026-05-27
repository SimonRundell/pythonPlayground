/**
 * @file AlgorithmsDrawer.jsx - Sliding right-side drawer displaying algorithm teaching content.
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
  'Selection':      '#3b82f6',
  'Strings':        '#8b5cf6',
  'Maths':          '#06b6d4',
  'Iteration':      '#f97316',
  'Lists':          '#22c55e',
  'Files':          '#eab308',
  'Number Systems': '#ec4899',
  'Searching':      '#64748b',
}

/**
 * Collapsible card for a single challenge task.
 * @param {object}   props
 * @param {object}   props.challenge
 * @param {(code: string) => void} props.onLoadCode
 */
function ChallengeCard({ challenge, onLoadCode }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="challenge-card">
      <button
        className="challenge-header"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
      >
        <span className="challenge-title">🎯 {challenge.title}</span>
        <span className="challenge-toggle" aria-hidden="true">
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      {expanded && (
        <div className="challenge-body">
          <p className="challenge-desc">{challenge.description}</p>
          {challenge.code && (
            <button
              className="btn btn-load-starter"
              onClick={() => onLoadCode(challenge.code)}
            >
              Load Starter Code →
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Collapsible card for a single algorithm with teaching notes, example code, and challenges.
 * @param {object}   props
 * @param {object}   props.algo
 * @param {boolean}  props.isExpanded
 * @param {() => void} props.onToggle
 * @param {(code: string) => void} props.onLoadCode
 */
function AlgoCard({ algo, isExpanded, onToggle, onLoadCode }) {
  const colour = CATEGORY_COLOURS[algo.category] ?? '#64748b'

  return (
    <div className="algo-card">
      <button
        className="algo-header"
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <span className="algo-title">{algo.title}</span>
        <span className="algo-badge" style={{ background: colour }}>
          {algo.category}
        </span>
        <span className="algo-toggle" aria-hidden="true">
          {isExpanded ? '▲' : '▼'}
        </span>
      </button>

      {isExpanded && (
        <div className="algo-body">
          <p className="algo-desc">{algo.description}</p>

          {algo.teachingNotes.length > 0 && (
            <div className="teaching-notes">
              <h4>Teaching Notes</h4>
              <ul>
                {algo.teachingNotes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="algo-code-block">
            <div className="code-block-header">
              <span>Example Code</span>
              <button
                className="btn btn-load-code"
                onClick={() => onLoadCode(algo.code)}
              >
                Load into Editor →
              </button>
            </div>
            <pre className="algo-code">{algo.code}</pre>
          </div>

          {algo.challenges.length > 0 && (
            <div className="algo-challenges">
              <h4>Challenges</h4>
              {algo.challenges.map((ch) => (
                <ChallengeCard key={ch.id} challenge={ch} onLoadCode={onLoadCode} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Right-side sliding drawer containing all algorithm content.
 * @param {object}   props
 * @param {boolean}  props.isOpen
 * @param {() => void} props.onClose
 * @param {(code: string) => void} props.onLoadCode
 */
function AlgorithmsDrawer({ isOpen, onClose, onLoadCode }) {
  const [search, setSearch]               = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [expandedId, setExpandedId]       = useState(null)

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

  function toggleCard(id) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  function toggleCategory(cat) {
    setActiveCategory((prev) => (prev === cat ? null : cat))
  }

  return (
    <>
      {isOpen && (
        <div
          className="drawer-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`algorithms-drawer${isOpen ? ' open' : ''}`}
        aria-label="Algorithms reference drawer"
        aria-hidden={!isOpen}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="drawer-header">
          <div className="drawer-title-row">
            <h2>📚 Algorithms</h2>
            <button
              className="modal-close"
              onClick={onClose}
              aria-label="Close algorithms drawer"
            >
              ✕
            </button>
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

        {/* ── Algorithm list ─────────────────────────────────── */}
        <div className="drawer-body">
          {filtered.length === 0 ? (
            <p className="drawer-empty">No algorithms match your search.</p>
          ) : (
            filtered.map((algo) => (
              <AlgoCard
                key={algo.id}
                algo={algo}
                isExpanded={expandedId === algo.id}
                onToggle={() => toggleCard(algo.id)}
                onLoadCode={onLoadCode}
              />
            ))
          )}
        </div>

        {/* ── Attribution footer ─────────────────────────────── */}
        <footer className="drawer-footer">
          <p>
            Content from{' '}
            <strong>The Little Book of Algorithms 2.0</strong>{' '}
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
    </>
  )
}

export default AlgorithmsDrawer
