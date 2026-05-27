/**
 * @file OutputPanel.jsx - Tabbed output panel: Console and Graphics.
 *
 * Console tab: printed text and error messages.
 * Graphics tab: turtle canvas + matplotlib PNG images.
 *
 * @license Creative Commons BY-NC-SA 4.0 - Simon Rundell
 */
import { useState, useEffect, useRef } from 'react'

/**
 * @param {object} props
 * @param {Array<{type:string,content:string}>} props.output
 * @param {() => void}               props.onClear
 * @param {React.RefObject}          props.turtleCanvasRef
 */
function OutputPanel({ output, onClear, turtleCanvasRef }) {
  const [activeTab, setActiveTab] = useState('console')
  const consoleEndRef = useRef(null)

  const hasImages = output.some((o) => o.type === 'image')
  const turtleUsed = typeof window._turtle_was_used === 'function' && window._turtle_was_used()

  // Auto-scroll console to bottom when new output arrives
  useEffect(() => {
    if (activeTab === 'console') {
      consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [output, activeTab])

  // Switch to Graphics tab automatically if a plot or turtle drawing appeared
  useEffect(() => {
    if (hasImages || turtleUsed) {
      setActiveTab('graphics')
    }
  }, [hasImages, turtleUsed])

  const consoleItems = output.filter((o) => o.type !== 'image')
  const imageItems = output.filter((o) => o.type === 'image')

  return (
    <div className="output-panel">
      <div className="output-tabs">
        <button
          className={`tab-btn ${activeTab === 'console' ? 'active' : ''}`}
          onClick={() => setActiveTab('console')}
        >
          Console
          {consoleItems.some((o) => o.type === 'error') && (
            <span className="tab-badge error">!</span>
          )}
        </button>
        <button
          className={`tab-btn ${activeTab === 'graphics' ? 'active' : ''}`}
          onClick={() => setActiveTab('graphics')}
        >
          Graphics
          {(hasImages || turtleUsed) && <span className="tab-badge">●</span>}
        </button>
        <button className="btn-clear" onClick={onClear} title="Clear output">
          ✕ Clear
        </button>
      </div>

      {/* ── Console ── */}
      <div className={`tab-content ${activeTab === 'console' ? 'visible' : 'hidden'}`}>
        <div className="console-output">
          {consoleItems.length === 0 ? (
            <span className="console-placeholder">Output will appear here…</span>
          ) : (
            consoleItems.map((item, i) => (
              <pre key={i} className={`console-line ${item.type}`}>
                {item.content}
              </pre>
            ))
          )}
          <div ref={consoleEndRef} />
        </div>
      </div>

      {/* ── Graphics ── */}
      <div className={`tab-content graphics-tab ${activeTab === 'graphics' ? 'visible' : 'hidden'}`}>
        {/* Turtle canvas – always present so the ref stays stable */}
        <div className="turtle-wrapper">
          <canvas
            ref={turtleCanvasRef}
            width={800}
            height={600}
            className="turtle-canvas"
          />
        </div>

        {/* Matplotlib images */}
        {imageItems.map((item, i) => (
          <div key={i} className="plot-wrapper">
            <img
              src={`data:image/png;base64,${item.content}`}
              alt={`Plot ${i + 1}`}
              className="plot-image"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default OutputPanel
