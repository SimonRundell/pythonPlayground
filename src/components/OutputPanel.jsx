/**
 * @file OutputPanel.jsx - Tabbed output panel: Console, Graphics and GUI.
 *
 * Console tab: printed text and error messages.
 * Graphics tab: turtle canvas + matplotlib PNG images.
 * GUI tab: guizero widgets (App/Box/Text/PushButton), plus a Stop button
 *   while a script is blocked inside App.display().
 *
 * @license Creative Commons BY-NC-SA 4.0 - Simon Rundell
 */
import { useState, useEffect, useRef } from 'react'

/**
 * @param {object} props
 * @param {Array<{type:string,content:string}>} props.output
 * @param {() => void}               props.onClear
 * @param {React.RefObject}          props.turtleCanvasRef
 * @param {React.RefObject}          props.guiContainerRef
 * @param {boolean}                  props.guiRunning
 * @param {() => void}               props.onStopGui
 */
function OutputPanel({ output, onClear, turtleCanvasRef, guiContainerRef, guiRunning, onStopGui }) {
  const [activeTab, setActiveTab] = useState('console')
  const consoleEndRef = useRef(null)

  const hasImages = output.some((o) => o.type === 'image')
  const turtleUsed = typeof window._turtle_was_used === 'function' && window._turtle_was_used()
  const guiUsed = typeof window._gui_was_used === 'function' && window._gui_was_used()

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

  // Switch to the GUI tab automatically once a guizero app is built
  useEffect(() => {
    if (guiUsed) {
      setActiveTab('gui')
    }
  }, [guiUsed])

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
        <button
          className={`tab-btn ${activeTab === 'gui' ? 'active' : ''}`}
          onClick={() => setActiveTab('gui')}
        >
          GUI
          {guiUsed && <span className="tab-badge">●</span>}
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
        {/* Canvas stays in DOM so the ref is always valid; wrapper hidden when unused */}
        <div className="turtle-wrapper" style={{ display: turtleUsed ? 'inline-block' : 'none' }}>
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

      {/* ── GUI (guizero) ── */}
      <div className={`tab-content gui-tab ${activeTab === 'gui' ? 'visible' : 'hidden'}`}>
        <div className="gui-toolbar">
          {guiRunning && (
            <button className="btn-gui-stop" onClick={onStopGui} title="Stop the running app">
              ⏹ Stop
            </button>
          )}
        </div>
        {/* Container stays in DOM so the ref is always valid; guiApi.js manages its children directly */}
        <div className="gui-wrapper" style={{ display: guiUsed ? 'inline-block' : 'none' }}>
          <div ref={guiContainerRef} className="gui-app-root" />
        </div>
        {!guiUsed && (
          <span className="console-placeholder">
            Build a guizero app (App, Text, PushButton…) and it will appear here.
          </span>
        )}
      </div>
    </div>
  )
}

export default OutputPanel
