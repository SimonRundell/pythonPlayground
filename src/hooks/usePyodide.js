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
 * @param {number} resetKey - Increment to destroy and re-create the Pyodide instance.
 */
function usePyodide(turtleCanvasRef, resetKey = 0) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Initialising…')
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState([])
  const [installedPackages, setInstalledPackages] = useState(new Set())
  const [installing, setInstalling] = useState(null)
  const [inputRequest, setInputRequest] = useState(null)

  const pyRef = useRef(null)
  /** Collects output items synchronously during a run; flushed to state on completion. */
  const runBuffer = useRef([])

  const clearOutput = useCallback(() => setOutput([]), [])

  // ── Initialisation ──────────────────────────────────────────────────────────
  useEffect(() => {
    // When resetKey > 0 the caller wants a clean slate — destroy the cached
    // Pyodide instance so getPyodide() creates a fresh one without any
    // previously-installed packages.
    if (resetKey > 0) {
      window._pyodidePromise = null
      pyRef.current = null
      setIsLoaded(false)
      setOutput([])
      setInstalledPackages(new Set())
      setLoadingMessage('Reinitialising…')
    }

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
import os, warnings
os.environ['MPLBACKEND'] = 'Agg'
warnings.filterwarnings('ignore', message='Matplotlib is currently using agg')

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

# Override input() with an async version backed by a React modal.
# The JS side creates a Promise; setInputRequest triggers the modal to render;
# when the user submits, the Promise resolves and Python continues.
async def _py_input(prompt=''):
    result = await _js._py_input_request(str(prompt))
    return '' if result is None else str(result)
builtins.input = _py_input

# AST transformer: rewrites input(...) → await input(...) in user code,
# and promotes any function containing await to async def.
import ast as _ast

class _InputTransformer(_ast.NodeTransformer):
    def __init__(self):
        self._new_async = set()
    def visit_Call(self, node):
        self.generic_visit(node)
        if isinstance(node.func, _ast.Name) and node.func.id == 'input':
            return _ast.copy_location(_ast.Await(value=node), node)
        return node
    def visit_FunctionDef(self, node):
        self.generic_visit(node)
        if any(isinstance(n, _ast.Await) for n in _ast.walk(_ast.Module(body=node.body, type_ignores=[]))):
            self._new_async.add(node.name)
            new = _ast.AsyncFunctionDef(name=node.name, args=node.args,
                body=node.body, decorator_list=node.decorator_list,
                returns=node.returns, lineno=node.lineno, col_offset=node.col_offset)
            return _ast.copy_location(new, node)
        return node

class _AsyncCallTransformer(_ast.NodeTransformer):
    def __init__(self, names):
        self._names = names
    def visit_Call(self, node):
        self.generic_visit(node)
        if isinstance(node.func, _ast.Name) and node.func.id in self._names:
            return _ast.copy_location(_ast.Await(value=node), node)
        return node

def _transform_input(source):
    try:
        tree = _ast.parse(source)
        t = _InputTransformer()
        tree = t.visit(tree)
        if t._new_async:
            tree = _AsyncCallTransformer(t._new_async).visit(tree)
        _ast.fix_missing_locations(tree)
        return _ast.unparse(tree)
    except Exception:
        return source

`)
        if (!mounted) return

        // Register the JS side of input(): creates a Promise that the React
        // InputModal resolves when the user submits a value.
        window._py_input_request = (prompt) => new Promise((resolve) => {
          setInputRequest({ prompt: String(prompt), resolve })
        })

        // ── Set up /workspace/ for student data and module files ─────────────
        try { py.FS.mkdir('/workspace') } catch (_) {}
        await py.runPythonAsync(`
import sys, os
if '/workspace' not in sys.path:
    sys.path.insert(0, '/workspace')
os.chdir('/workspace')
`)

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
  }, [resetKey]) // eslint-disable-line react-hooks/exhaustive-deps

  // Re-init turtle canvas when the ref becomes available after first load
  useEffect(() => {
    if (isLoaded && turtleCanvasRef.current) {
      initTurtleApi(turtleCanvasRef.current)
    }
  }, [isLoaded, turtleCanvasRef])

  // ── Code execution ──────────────────────────────────────────────────────────
  /**
   * @param {string} code          - Python source to execute (the active file)
   * @param {object} [workspaceFiles] - All workspace files { filename: content }
   *   Written to /workspace/ so they are importable and openable by the code.
   */
  const runCode = useCallback(async (code, workspaceFiles) => {
    if (!pyRef.current || isRunning) return

    setIsRunning(true)
    runBuffer.current = []
    if (window._turtle_reset) window._turtle_reset()

    // Sync all workspace files to Pyodide's /workspace/ directory
    if (workspaceFiles) {
      for (const [filename, content] of Object.entries(workspaceFiles)) {
        try {
          pyRef.current.FS.writeFile(`/workspace/${filename}`, content)
        } catch (_) {
          try {
            pyRef.current.FS.writeFile(`/workspace/${filename}`,
              new TextEncoder().encode(content))
          } catch (err) {
            console.warn(`Could not sync ${filename} to workspace:`, err)
          }
        }
      }
    }

    try {
      // Transform input() → await input() using the Python AST transformer
      // defined during initialisation.  Falls back to original code on error.
      const transformProxy = await pyRef.current.runPythonAsync(
        `_transform_input(${JSON.stringify(code)})`
      )
      const transformedCode = String(transformProxy)

      // Patch plt.show() to capture figures into _mpl_captured at call time.
      // Must run before user code so the patch is in place when show() is called.
      await pyRef.current.runPythonAsync(`
_mpl_captured = []
try:
    import matplotlib
    matplotlib.use('agg')
    import matplotlib.pyplot as _plt, io as _io, base64 as _b64
    def _show_capture(*_a, **_kw):
        for _fn in list(_plt.get_fignums()):
            _buf = _io.BytesIO()
            _plt.figure(_fn).savefig(_buf, format='png', bbox_inches='tight', dpi=100)
            _buf.seek(0)
            _mpl_captured.append(_b64.b64encode(_buf.getvalue()).decode())
        _plt.close('all')
    _plt.show = _show_capture
except ImportError:
    pass
`)

      await pyRef.current.runPythonAsync(transformedCode)

      // Capture any figures left open (user created plots without calling plt.show()).
      // IMPORTANT: the return value must be a bare top-level expression — Pyodide only
      // captures the result when the last statement in the code string is an ast.Expr,
      // not a try/except block.
      const mplProxy = await pyRef.current.runPythonAsync(`
try:
    import matplotlib.pyplot as _plt, io as _io, base64 as _b64
    for _fn in list(_plt.get_fignums()):
        _buf = _io.BytesIO()
        _plt.figure(_fn).savefig(_buf, format='png', bbox_inches='tight', dpi=100)
        _buf.seek(0)
        _mpl_captured.append(_b64.b64encode(_buf.getvalue()).decode())
    _plt.close('all')
except Exception:
    pass
_mpl_captured
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

  // ── Bulk sequential installation (used for auto-install on file load) ─────
  const installPackages = useCallback(async (packageIds) => {
    if (!pyRef.current || !packageIds.length) return
    for (const id of packageIds) {
      setInstalling(id)
      try {
        await pyRef.current.loadPackage(id)
        setInstalledPackages((prev) => new Set([...prev, id]))
      } catch (_) {
        try {
          await pyRef.current.runPythonAsync(
            `import micropip; await micropip.install('${id}')`
          )
          setInstalledPackages((prev) => new Set([...prev, id]))
        } catch (err) {
          console.warn(`Auto-install of ${id} failed:`, err.message)
        }
      } finally {
        setInstalling(null)
      }
    }
  }, []) // no dependency on `installing` — bypasses the single-install guard intentionally

  const resolveInput = useCallback((value) => {
    setInputRequest((req) => {
      if (req) req.resolve(value ?? '')
      return null
    })
  }, [])

  return {
    isLoaded,
    loadingMessage,
    isRunning,
    output,
    clearOutput,
    runCode,
    installedPackages,
    installPackage,
    installPackages,
    installing,
    inputRequest,
    resolveInput,
  }
}

export default usePyodide
