/**
 * @file usePyodide.js - React hook managing a Pyodide Python interpreter instance.
 *
 * Design notes:
 *  - Pyodide itself is stored on `window._pyodideInstance` so it survives Vite HMR
 *    reloads without the expensive re-download + re-init.
 *  - Python environment setup (stdout redirect, sys.path, etc.) re-runs on every
 *    hook mount so that `sys.stdout` always points to the current render's buffer.
 *  - All virtual-FS operations are wrapped in try/catch – they are idempotent so
 *    safe to repeat on hot-reload.
 *  - `pyRef.current` is set only after full setup, preventing a partially-initialised
 *    instance from being used by `runCode`.
 *
 * @license Creative Commons BY-NC-SA 4.0 - Simon Rundell
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { initTurtleApi } from '../utils/turtleApi'

const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'

/** Load the Pyodide script tag once. */
async function ensurePyodideScript() {
  if (window.loadPyodide) return
  await new Promise((res, rej) => {
    const s = document.createElement('script')
    s.src = `${PYODIDE_CDN}pyodide.js`
    s.onload = res
    s.onerror = () => rej(new Error('Failed to load Pyodide script from CDN'))
    document.head.appendChild(s)
  })
}

/**
 * Get (or create) the single Pyodide instance stored on `window`.
 * Using window ensures the heavy WASM download only happens once per page load,
 * even across Vite HMR module reloads.
 * @param {(msg: string) => void} onProgress
 */
async function getPyodide(onProgress) {
  if (!window._pyodidePromise) {
    window._pyodidePromise = (async () => {
      onProgress('Loading Python engine…')
      await ensurePyodideScript()
      onProgress('Starting Python interpreter…')
      const py = await window.loadPyodide({ indexURL: PYODIDE_CDN })
      onProgress('Loading micropip…')
      await py.loadPackage('micropip')
      return py
    })()
  }
  return window._pyodidePromise
}

/**
 * @typedef {{type: 'text'|'error'|'image', content: string}} OutputItem
 */

/**
 * Hook for the Python interpreter.
 * @param {React.RefObject<HTMLCanvasElement>} turtleCanvasRef
 */
function usePyodide(turtleCanvasRef) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Initialising…')
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState([])
  const [installedPackages, setInstalledPackages] = useState(new Set())
  const [installing, setInstalling] = useState(null)

  const pyRef = useRef(null)
  /** Collects output items synchronously during a run; flushed to state on completion. */
  const runBuffer = useRef([])

  const clearOutput = useCallback(() => setOutput([]), [])

  // ── Initialisation ──────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true

    async function init() {
      try {
        const py = await getPyodide((msg) => {
          if (mounted) setLoadingMessage(msg)
        })
        if (!mounted) return

        if (mounted) setLoadingMessage('Setting up environment…')

        // ── Wire stdout / stderr capture ──────────────────────────────────────
        // These must be set before running the Python setup so that the Python
        // `from js import _py_stdout` picks up the current render's buffer.
        window._py_stdout = (text) => {
          const buf = runBuffer.current
          const last = buf[buf.length - 1]
          if (last && last.type === 'text') {
            last.content += text
          } else {
            buf.push({ type: 'text', content: text })
          }
        }
        window._py_stderr = (text) => {
          const buf = runBuffer.current
          const last = buf[buf.length - 1]
          if (last && last.type === 'error') {
            last.content += text
          } else {
            buf.push({ type: 'error', content: text })
          }
        }

        // ── Python environment setup ──────────────────────────────────────────
        // Re-run on every mount so sys.stdout always points to the latest
        // window._py_stdout (which closes over the current runBuffer).
        // Use `js._py_stdout(text)` (live attribute lookup) rather than
        // `from js import _py_stdout` (snapshot at import time) so that
        // replacing window._py_stdout on HMR reloads is picked up automatically.
        await py.runPythonAsync(`
import sys, builtins, js as _js

class _Capture:
    def __init__(self, is_err=False):
        self.is_err = is_err
    def write(self, text):
        if text:
            if self.is_err:
                _js._py_stderr(text)
            else:
                _js._py_stdout(text)
    def flush(self):
        pass
    def fileno(self):
        raise OSError('not a real file')

sys.stdout = _Capture(False)
sys.stderr = _Capture(True)

# Override input() to use browser prompt dialog
def _py_input(prompt=''):
    result = _js.window.prompt(str(prompt))
    return '' if result is None else str(result)
builtins.input = _py_input

# Pre-configure matplotlib backend so plt.show() saves to buffer silently
try:
    import matplotlib
    matplotlib.use('Agg')
except Exception:
    pass
`)
        if (!mounted) return

        // ── Inject custom Python modules into Pyodide's virtual FS ───────────
        if (mounted) setLoadingMessage('Loading modules…')
        const turtleCode = await fetch('/py_modules/turtle.py').then((r) => r.text())
        if (!mounted) return

        // mkdir is idempotent here – if it already exists from a previous init,
        // just ignore the error and overwrite the file.
        try { py.FS.mkdir('/pyodide_modules') } catch (_) {}
        py.FS.writeFile('/pyodide_modules/turtle.py', turtleCode)

        // Add to sys.path only once
        await py.runPythonAsync(`
import sys
if '/pyodide_modules' not in sys.path:
    sys.path.insert(0, '/pyodide_modules')
`)
        if (!mounted) return

        // ── Commit ────────────────────────────────────────────────────────────
        // Set pyRef only after the full setup so runCode never sees a partial state.
        pyRef.current = py

        if (turtleCanvasRef.current) {
          initTurtleApi(turtleCanvasRef.current)
        }

        if (mounted) {
          setIsLoaded(true)
          setLoadingMessage('')
        }
      } catch (err) {
        console.error('Pyodide init error:', err)
        if (mounted) {
          setLoadingMessage(`Error loading Python: ${err.message ?? String(err)}`)
        }
      }
    }

    init()
    return () => { mounted = false }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Re-init turtle canvas when the ref becomes available after first load
  useEffect(() => {
    if (isLoaded && turtleCanvasRef.current) {
      initTurtleApi(turtleCanvasRef.current)
    }
  }, [isLoaded, turtleCanvasRef])

  // ── Code execution ──────────────────────────────────────────────────────────
  const runCode = useCallback(async (code) => {
    if (!pyRef.current || isRunning) return

    setIsRunning(true)
    runBuffer.current = []
    if (window._turtle_reset) window._turtle_reset()

    try {
      await pyRef.current.runPythonAsync(code)

      // Harvest any matplotlib figures produced by the run
      const mplProxy = await pyRef.current.runPythonAsync(`
try:
    import io, base64
    import matplotlib.pyplot as plt
    _imgs = []
    for _fn in plt.get_fignums():
        _buf = io.BytesIO()
        plt.figure(_fn).savefig(_buf, format='png', bbox_inches='tight', dpi=100)
        _buf.seek(0)
        _imgs.append(base64.b64encode(_buf.getvalue()).decode('utf-8'))
    plt.close('all')
    _imgs
except Exception:
    []
`)
      const imgs = mplProxy?.toJs?.() ?? []
      imgs.forEach((img) => runBuffer.current.push({ type: 'image', content: img }))

    } catch (err) {
      runBuffer.current.push({ type: 'error', content: err.message })
    } finally {
      setOutput([...runBuffer.current])
      setIsRunning(false)
    }
  }, [isRunning])

  // ── Package installation ────────────────────────────────────────────────────
  const installPackage = useCallback(async (packageId) => {
    if (!pyRef.current || installing) return

    setInstalling(packageId)
    try {
      await pyRef.current.loadPackage(packageId)
      setInstalledPackages((prev) => new Set([...prev, packageId]))
    } catch (_) {
      // loadPackage failed – try micropip (covers pure-Python wheels)
      try {
        await pyRef.current.runPythonAsync(
          `import micropip; await micropip.install('${packageId}')`
        )
        setInstalledPackages((prev) => new Set([...prev, packageId]))
      } catch (err) {
        throw new Error(`Could not install ${packageId}: ${err.message}`)
      }
    } finally {
      setInstalling(null)
    }
  }, [installing])

  return {
    isLoaded,
    loadingMessage,
    isRunning,
    output,
    clearOutput,
    runCode,
    installedPackages,
    installPackage,
    installing,
  }
}

export default usePyodide
