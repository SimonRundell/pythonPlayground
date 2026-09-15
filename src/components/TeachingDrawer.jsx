/**
 * @file TeachingDrawer.jsx - Generic sliding right-side drawer and full-detail
 * modal for browsing a searchable, category-filterable list of teaching
 * topics (algorithms, language fundamentals, etc).
 *
 * Configured entirely via props so the same interaction pattern (search,
 * category chips, detail modal, "Load into Editor") can be reused for
 * different content sets — see AlgorithmsDrawer and PythonBasicsDrawer.
 *
 * @license Creative Commons BY-NC-SA 4.0 - Simon Rundell
 */
import { useState, useMemo } from 'react'

// ── Detail modal ──────────────────────────────────────────────────────────────

/**
 * Full-screen modal showing all content for a single topic.
 * @param {object}   props
 * @param {object}   props.topic
 * @param {object}   props.categoryColours
 * @param {(code: string) => void} props.onLoadCode
 * @param {() => void} props.onClose
 */
function TopicDetailModal({ topic, categoryColours, onLoadCode, onClose }) {
  const colour = categoryColours[topic.category] ?? '#64748b'

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
              {topic.category}
            </span>
            <h2 className="algo-detail-title">{topic.title}</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Content — modal itself scrolls via base .modal overflow-y:auto */}
        <div className="algo-detail-content">
          <p className="algo-detail-desc">{topic.description}</p>

          {/* Optional illustration — trusted, author-written SVG markup */}
          {topic.illustration && (
            <div className="algo-detail-section">
              <div className="algo-illustration" dangerouslySetInnerHTML={{ __html: topic.illustration }} />
            </div>
          )}

          {/* Teaching notes */}
          {topic.teachingNotes?.length > 0 && (
            <div className="algo-detail-section">
              <h3 className="algo-detail-section-heading">Teaching Notes</h3>
              <ul className="algo-detail-notes">
                {topic.teachingNotes.map((note, i) => (
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
                onClick={() => loadAndClose(topic.code)}
              >
                Load into Editor →
              </button>
            </div>
            <pre className="algo-code">{topic.code}</pre>
          </div>

          {/* Challenges */}
          {topic.challenges?.length > 0 && (
            <div className="algo-detail-section">
              <h3 className="algo-detail-section-heading">Challenges</h3>
              {topic.challenges.map((ch) => (
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
        </div>
      </div>
    </div>
  )
}

// ── List row ──────────────────────────────────────────────────────────────────

/**
 * Simple clickable row in the topic list.
 * @param {object}   props
 * @param {object}   props.topic
 * @param {object}   props.categoryColours
 * @param {() => void} props.onSelect
 */
function TopicListItem({ topic, categoryColours, onSelect }) {
  const colour = categoryColours[topic.category] ?? '#64748b'
  return (
    <div
      className="algo-list-item"
      onClick={onSelect}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      role="button"
      tabIndex={0}
      aria-label={`View ${topic.title}`}
    >
      <span className="algo-title">{topic.title}</span>
      <span className="algo-badge" style={{ background: colour }}>
        {topic.category}
      </span>
      <span className="algo-list-chevron" aria-hidden="true">›</span>
    </div>
  )
}

// ── Main drawer ───────────────────────────────────────────────────────────────

/**
 * Right-side sliding drawer containing a searchable, filterable topic index.
 *
 * @param {object}   props
 * @param {boolean}  props.isOpen
 * @param {() => void} props.onClose
 * @param {(code: string) => void} props.onLoadCode
 * @param {object[]} props.items              - topics to list (id, title, category, description, teachingNotes, illustration?, code, challenges)
 * @param {string[]} props.categories         - ordered category names, used for filter chips + sort order
 * @param {object}   props.categoryColours    - { [category]: hexColour }
 * @param {string}   props.icon               - header emoji
 * @param {string}   props.title              - header title text
 * @param {import('react').ReactNode} [props.subtitle]
 * @param {string}   [props.searchPlaceholder]
 * @param {string}   [props.emptyMessage]
 * @param {import('react').ReactNode} [props.footer]
 * @param {string}   props.ariaLabel
 */
function TeachingDrawer({
  isOpen, onClose, onLoadCode,
  items, categories, categoryColours,
  icon, title, subtitle,
  searchPlaceholder = 'Search…',
  emptyMessage = 'Nothing matches your search.',
  footer, ariaLabel,
}) {
  const [search, setSearch]               = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return items
      .filter((topic) => {
        const matchCat  = !activeCategory || topic.category === activeCategory
        const matchText = !q ||
          topic.title.toLowerCase().includes(q) ||
          topic.description.toLowerCase().includes(q) ||
          (topic.teachingNotes ?? []).some((n) => n.toLowerCase().includes(q))
        return matchCat && matchText
      })
      .sort((a, b) => {
        const ai = categories.indexOf(a.category)
        const bi = categories.indexOf(b.category)
        return ai !== bi ? ai - bi : a.id - b.id
      })
  }, [items, categories, search, activeCategory])

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
        aria-label={ariaLabel}
        aria-hidden={!isOpen}
      >
        {/* ── Header ── */}
        <div className="drawer-header">
          <div className="drawer-title-row">
            <h2>{icon} {title}</h2>
            <button className="modal-close" onClick={onClose} aria-label="Close drawer">✕</button>
          </div>

          {subtitle && <p className="drawer-subtitle">{subtitle}</p>}

          <input
            type="search"
            className="drawer-search"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={searchPlaceholder}
          />

          <div className="category-chips" role="group" aria-label="Filter by category">
            <button
              className={`chip${!activeCategory ? ' chip-active' : ''}`}
              onClick={() => setActiveCategory(null)}
            >
              All
            </button>
            {categories.map((cat) => {
              const active = activeCategory === cat
              return (
                <button
                  key={cat}
                  className={`chip${active ? ' chip-active' : ''}`}
                  style={active
                    ? { background: categoryColours[cat], borderColor: categoryColours[cat], color: '#fff' }
                    : {}}
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Topic list ── */}
        <div className="drawer-body">
          {filtered.length === 0 ? (
            <p className="drawer-empty">{emptyMessage}</p>
          ) : (
            filtered.map((topic) => (
              <TopicListItem
                key={topic.id}
                topic={topic}
                categoryColours={categoryColours}
                onSelect={() => setSelectedTopic(topic)}
              />
            ))
          )}
        </div>

        {/* ── Footer ── */}
        {footer && <footer className="drawer-footer">{footer}</footer>}
      </aside>

      {/* ── Detail modal (rendered outside the drawer so it overlays everything) ── */}
      {selectedTopic && (
        <TopicDetailModal
          topic={selectedTopic}
          categoryColours={categoryColours}
          onLoadCode={onLoadCode}
          onClose={() => setSelectedTopic(null)}
        />
      )}
    </>
  )
}

export default TeachingDrawer
