/**
 * @file App.jsx - Root component for Python Playground.
 *
 * Layout: full-viewport flex column.
 *   Header  – branding + Toolbar
 *   Body    – CodeEditor (left) | OutputPanel (right)
 *   Modal   – LibraryManager (conditionally rendered)
 *
 * @license Creative Commons BY-NC-SA 4.0 - Simon Rundell
 */
import { useState, useRef, useCallback } from 'react'
import Toolbar from './components/Toolbar'
import CodeEditor from './components/CodeEditor'
import OutputPanel from './components/OutputPanel'
import LibraryManager from './components/LibraryManager'
import AlgorithmsDrawer from './components/AlgorithmsDrawer'
import usePyodide from './hooks/usePyodide'
import { loadFile, saveFile } from './utils/fileHandling'
import CMFloatAd from './components/cmFloatAd'

const DEFAULT_CODE = `# Python Playground
# Write your Python code here and click  ▶ Run  (or press Ctrl+Enter)

print("Hello, World!")
print()

# A simple loop
for i in range(1, 6):
    print(f"  {i} x {i} = {i * i}")

# input() uses the browser prompt dialog. Uncomment to test it out:
# name = input("What is your name? ")
# print(f"Hello, {name}!")
`

function App() {
  const [code, setCode] = useState(DEFAULT_CODE)
  const [showPackages, setShowPackages] = useState(false)
  const [showAlgorithms, setShowAlgorithms] = useState(false)
  const [currentFilename, setCurrentFilename] = useState('script.py')

  const turtleCanvasRef = useRef(null)

  const {
    isLoaded,
    loadingMessage,
    isRunning,
    output,
    clearOutput,
    runCode,
    installedPackages,
    installPackage,
    installing,
  } = usePyodide(turtleCanvasRef)

  const handleRun = useCallback(() => {
    runCode(code)
  }, [code, runCode])

  const handleLoad = useCallback(async () => {
    const { content, filename } = await loadFile()
    if (content !== null) {
      setCode(content)
      if (filename) setCurrentFilename(filename)
    }
  }, [])

  const handleSave = useCallback(() => {
    saveFile(code, currentFilename)
  }, [code, currentFilename])

  const handleLoadAlgorithmCode = useCallback((algorithmCode) => {
    setCode(algorithmCode)
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">
          <span className="app-logo" aria-hidden="true"><img className="app-logo-img" src="/favicon.png" alt="Python Playground" /></span>
          Python Playground
        </div>
        <Toolbar
          onRun={handleRun}
          onLoad={handleLoad}
          onSave={handleSave}
          onPackages={() => setShowPackages(true)}
          onAlgorithms={() => setShowAlgorithms(true)}
          isRunning={isRunning}
          pyodideLoaded={isLoaded}
          loadingMessage={loadingMessage}
        />
      </header>

      <main className="app-body">
        <div className="editor-pane">
          <CodeEditor value={code} onChange={setCode} onRun={handleRun} />
        </div>
        <div className="output-pane">
          <OutputPanel
            output={output}
            onClear={clearOutput}
            turtleCanvasRef={turtleCanvasRef}
          />
        </div>
      </main>

      {showPackages && (
        <LibraryManager
          onClose={() => setShowPackages(false)}
          installedPackages={installedPackages}
          onInstall={installPackage}
          installing={installing}
        />
      )}

      <AlgorithmsDrawer
        isOpen={showAlgorithms}
        onClose={() => setShowAlgorithms(false)}
        onLoadCode={handleLoadAlgorithmCode}
      />

      <CMFloatAd bgColor="transparent" />
    </div>
  )
}

export default App
