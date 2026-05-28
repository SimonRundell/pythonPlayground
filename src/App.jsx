/**
 * @file App.jsx - Root component for Python Playground.
 *
 * Layout: full-viewport flex column.
 *   Header  – branding + Toolbar
 *   Body    – CodeEditor (left, with FileTabs) | OutputPanel (right)
 *   Modals  – LibraryManager, SaveAsModal, ConfirmModal, InputModal
 *
 * Workspace model:
 *   `files`      – plain object { [filename: string]: string }
 *   `activeFile` – the filename currently shown in the editor
 *   All files are written to Pyodide's /workspace/ before each run, making
 *   them importable (for .py) or openable with open() (for .csv / .json).
 *
 * @license Creative Commons BY-NC-SA 4.0 - Simon Rundell
 */
import { useState, useRef, useCallback } from 'react'
import Toolbar from './components/Toolbar'
import CodeEditor from './components/CodeEditor'
import FileTabs from './components/FileTabs'
import OutputPanel from './components/OutputPanel'
import LibraryManager from './components/LibraryManager'
import SaveAsModal from './components/SaveAsModal'
import ConfirmModal from './components/ConfirmModal'
import InputModal from './components/InputModal'
import AlgorithmsDrawer from './components/AlgorithmsDrawer'
import usePyodide from './hooks/usePyodide'
import { loadFiles, saveFile, saveFilesAsZip, languageForFile } from './utils/fileHandling'
import { detectMissingPackages } from './utils/packages'
import CMFloatAd from './components/cmFloatAd'

const DEFAULT_FILENAME = 'script.py'

const DEFAULT_CODE = `# Python Playground
# Write your Python code here and click  ▶ Run  (or press Ctrl+Enter)

print("Hello, World!")
print()

# A simple loop
for i in range(1, 6):
    print(f"  {i} x {i} = {i * i}")

# input() uses a modal dialog. Uncomment to try:
# name = input("What is your name? ")
# print(f"Hello, {name}!")
`

function App() {
  // ── Workspace state ─────────────────────────────────────────────────────────
  const [files, setFiles]           = useState({ [DEFAULT_FILENAME]: DEFAULT_CODE })
  const [activeFile, setActiveFile] = useState(DEFAULT_FILENAME)

  // ── UI state ────────────────────────────────────────────────────────────────
  const [showPackages, setShowPackages]   = useState(false)
  const [showAlgorithms, setShowAlgorithms] = useState(false)
  const [showSaveAs, setShowSaveAs]       = useState(false)
  const [showReset, setShowReset]         = useState(false)
  const [resetKey, setResetKey]           = useState(0)

  const turtleCanvasRef = useRef(null)

  const {
    isLoaded, loadingMessage, isRunning,
    output, clearOutput, runCode,
    installedPackages, installPackage, installPackages, installing,
    inputRequest, resolveInput,
  } = usePyodide(turtleCanvasRef, resetKey)

  // ── Derived values ──────────────────────────────────────────────────────────
  const activeCode     = files[activeFile] ?? ''
  const fileCount      = Object.keys(files).length
  const activeLang     = languageForFile(activeFile)

  // ── Editor change ───────────────────────────────────────────────────────────
  const handleCodeChange = useCallback((value) => {
    setFiles((prev) => ({ ...prev, [activeFile]: value }))
  }, [activeFile])

  // ── Run ─────────────────────────────────────────────────────────────────────
  const handleRun = useCallback(() => {
    runCode(activeCode, files)
  }, [activeCode, files, runCode])

  // ── File tab management ─────────────────────────────────────────────────────
  const handleAddFile = useCallback(async () => {
    const loaded = await loadFiles()
    if (!loaded.length) return

    setFiles((prev) => {
      const next = { ...prev }
      loaded.forEach(({ filename, content }) => { next[filename] = content })
      return next
    })
    // Switch to the first loaded file
    setActiveFile(loaded[0].filename)

    // Auto-install packages detected in any loaded .py file
    const allPy = loaded
      .filter(({ filename }) => filename.endsWith('.py'))
      .map(({ content }) => content)
      .join('\n')
    const missing = detectMissingPackages(allPy, installedPackages)
    if (missing.length) installPackages(missing)
  }, [installedPackages, installPackages])

  const handleRemoveFile = useCallback((filename) => {
    setFiles((prev) => {
      const next = { ...prev }
      delete next[filename]
      return next
    })
    // If removing the active file, switch to first remaining file
    if (filename === activeFile) {
      setActiveFile((prev) => {
        const remaining = Object.keys(files).filter((f) => f !== prev)
        return remaining[0] ?? DEFAULT_FILENAME
      })
    }
  }, [activeFile, files])

  // ── Load (toolbar button — replaces entire workspace or adds files) ─────────
  const handleLoad = useCallback(async () => {
    const loaded = await loadFiles()
    if (!loaded.length) return

    if (loaded.length === 1 && loaded[0].filename.endsWith('.py')) {
      // Single .py file — replace active file content (classic behaviour)
      const { filename, content } = loaded[0]
      setFiles((prev) => ({ ...prev, [filename]: content }))
      setActiveFile(filename)
    } else {
      // Multiple files (e.g. from ZIP) — merge into workspace
      setFiles((prev) => {
        const next = { ...prev }
        loaded.forEach(({ filename, content }) => { next[filename] = content })
        return next
      })
      // Switch to first .py file found, or first file
      const firstPy = loaded.find(({ filename }) => filename.endsWith('.py'))
      setActiveFile((firstPy ?? loaded[0]).filename)
    }

    // Auto-install packages from any .py files
    const allPy = loaded
      .filter(({ filename }) => filename.endsWith('.py'))
      .map(({ content }) => content)
      .join('\n')
    const missing = detectMissingPackages(allPy, installedPackages)
    if (missing.length) installPackages(missing)
  }, [installedPackages, installPackages])

  // ── Save ────────────────────────────────────────────────────────────────────
  const handleSave = useCallback(() => {
    setShowSaveAs(true)
  }, [])

  const handleSaveConfirm = useCallback(async (nameInput) => {
    setShowSaveAs(false)
    if (fileCount === 1) {
      // Single file — save as .py
      const filename = nameInput.endsWith('.py') ? nameInput : `${nameInput}.py`
      setFiles((prev) => {
        const next = {}
        for (const [k, v] of Object.entries(prev)) {
          next[k === activeFile ? filename : k] = v
        }
        return next
      })
      setActiveFile(nameInput.endsWith('.py') ? nameInput : `${nameInput}.py`)
      saveFile(activeCode, filename)
    } else {
      // Multiple files — save as ZIP
      const zipName = nameInput.endsWith('.zip') ? nameInput : `${nameInput}.zip`
      await saveFilesAsZip(files, zipName)
    }
  }, [fileCount, activeCode, activeFile, files])

  // ── Reset ───────────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setFiles({ [DEFAULT_FILENAME]: DEFAULT_CODE })
    setActiveFile(DEFAULT_FILENAME)
    setResetKey((k) => k + 1)
  }, [])

  // ── Algorithms drawer ───────────────────────────────────────────────────────
  const handleLoadAlgorithmCode = useCallback((algorithmCode) => {
    setFiles((prev) => ({ ...prev, [activeFile]: algorithmCode }))
  }, [activeFile])

  // ── SaveAsModal initial name ────────────────────────────────────────────────
  const saveAsInitialName = fileCount === 1
    ? (activeFile.endsWith('.py') ? activeFile : `${activeFile}.py`)
    : (activeFile.replace(/\.py$/, '') || 'workspace')

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">
          <span className="app-logo" aria-hidden="true">
            <img className="app-logo-img" src="/favicon.png" alt="Python Playground" />
          </span>
          Python Playground
        </div>
        <Toolbar
          onRun={handleRun}
          onLoad={handleLoad}
          onSave={handleSave}
          onPackages={() => setShowPackages(true)}
          onAlgorithms={() => setShowAlgorithms(true)}
          onReset={() => setShowReset(true)}
          isRunning={isRunning}
          installing={installing}
          pyodideLoaded={isLoaded}
          loadingMessage={loadingMessage}
        />
      </header>

      <main className="app-body">
        <div className="editor-pane">
          <FileTabs
            files={files}
            activeFile={activeFile}
            onSelect={setActiveFile}
            onRemove={handleRemoveFile}
            onAdd={handleAddFile}
          />
          <CodeEditor
            value={activeCode}
            onChange={handleCodeChange}
            onRun={handleRun}
            language={activeLang}
          />
        </div>
        <div className="output-pane">
          <OutputPanel
            output={output}
            onClear={clearOutput}
            turtleCanvasRef={turtleCanvasRef}
          />
        </div>
      </main>

      {inputRequest && (
        <InputModal
          prompt={inputRequest.prompt}
          onSubmit={(value) => resolveInput(value)}
          onCancel={() => resolveInput('')}
        />
      )}

      {showReset && (
        <ConfirmModal
          title="🔄 Reset Playground"
          message="This will clear all workspace files, restore the Hello World starter, and uninstall all packages. The Python environment will reinitialise."
          confirmLabel="Reset"
          confirmClass="btn-danger"
          onConfirm={handleReset}
          onClose={() => setShowReset(false)}
        />
      )}

      {showSaveAs && (
        <SaveAsModal
          initialName={saveAsInitialName}
          onSave={handleSaveConfirm}
          onClose={() => setShowSaveAs(false)}
          hint={fileCount > 1 ? 'Multiple files — will be saved as a ZIP archive.' : ''}
        />
      )}

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
