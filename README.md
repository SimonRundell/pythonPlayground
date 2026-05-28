# Python Playground

A browser-based Python IDE that runs entirely client-side — no server, no installation, no Python runtime required on the host machine.  Built for use in Further Education classrooms where students need an immediate, zero-friction Python environment.

---

## Features

| Feature | Details |
|---|---|
| **Monaco Editor** | VS Code-quality editor with Python syntax highlighting, bracket colouring, and autocompletion |
| **Pyodide (CPython in WASM)** | Full CPython 3.x interpreter compiled to WebAssembly — code runs in the browser tab |
| **Multi-file Workspace** | VS Code-style file tabs; add `.py`, `.csv`, and `.json` files alongside the main script |
| **ZIP Load / Save** | Load a ZIP to restore a full project; Save bundles all workspace files into a ZIP automatically |
| **Module & Data File Support** | All workspace files are written to `/workspace/` before each run — `import helpers` and `open('data.csv')` work out of the box |
| **Turtle Graphics** | Custom canvas-based turtle backend; `import turtle` works out of the box |
| **Matplotlib** | Charts rendered to PNG and displayed in the Graphics tab after `plt.show()` |
| **Package Manager** | One-click install of scientific packages (NumPy, Pandas, SciPy, scikit-learn, and more) via micropip |
| **Auto-install on Load** | Opening a `.py` file automatically detects and installs any required curated packages |
| **`input()` modal** | Python's `input()` opens a styled modal dialog; no native browser prompt |
| **Tabbed output** | Separate Console and Graphics tabs; auto-switches to Graphics when turtle or matplotlib output is produced |
| **Algorithms Drawer** | Sliding reference panel with searchable index and full-detail modal for each algorithm, from *The Little Book of Algorithms 2.0* by William Lau (CC BY-NC-SA 4.0) |
| **Playground Reset** | One-click reset clears all workspace files, restores Hello World, and fully reinitialises the Python environment |

---

## Tech Stack

- [React 19](https://react.dev/) + [Vite 8](https://vite.dev/) — UI framework and build tool
- [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react) — Monaco Editor integration
- [Pyodide 0.26.4](https://pyodide.org/) — CPython compiled to WebAssembly (loaded from CDN)
- [JSZip](https://stuk.github.io/jszip/) — ZIP archive creation and extraction
- HTML5 Canvas API — Turtle graphics rendering

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm (bundled with Node.js)

### Installation

```bash
# Clone or download the repository
git clone <repo-url>
cd pythonPlayground

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in a browser.  The first page load downloads the Pyodide WASM bundle (~10 MB) from the jsDelivr CDN; subsequent loads use the browser cache.

### Production Build

```bash
npm run build
# Output is in the dist/ folder — serve as a static site
npm run preview   # preview the production build locally
```

---

## Usage

### Running Code

Write Python in the editor and click **▶ Run** or press **Ctrl+Enter**.

### Turtle Graphics

`turtle` is always available — no installation needed:

```python
import turtle

t = turtle.Turtle()
for _ in range(4):
    t.forward(100)
    t.right(90)
```

Output appears in the **Graphics** tab automatically.  The turtle canvas is hidden until drawing commands are issued.

### Matplotlib

```python
import matplotlib.pyplot as plt

plt.plot([1, 2, 3, 4])
plt.title("My Chart")
plt.show()
```

The chart is rendered to PNG and shown in the **Graphics** tab.  Install Matplotlib first via **📦 Packages** if it is not already loaded.

### Installing Packages

Click **📦 Packages** in the toolbar and select the packages your program needs.  Packages are downloaded once per browser session.  When a `.py` file is loaded from disk, any recognised imports are installed automatically.

### Multi-file Workspace

The editor supports multiple files simultaneously via a VS Code-style tab bar directly above the editor:

- **`+` button** — opens a file picker to add a `.py`, `.csv`, or `.json` file to the workspace without replacing existing files.
- **📂 Load** — loads a single file or a ZIP archive.  A ZIP unpacks all its text files into the workspace at once.
- **💾 Save** — with one file open saves as `.py`; with multiple files open prompts for a project name and downloads a `.zip` containing every workspace file.
- **Closing a tab** — click the `×` on any tab to remove that file from the workspace (only available when two or more files are open).

All workspace files are written to `/workspace/` in Pyodide's virtual filesystem before each run and the working directory is set to `/workspace/`.  This means:

```python
# Import another .py file from the workspace
import helpers          # if helpers.py is open in a tab

# Read a CSV or JSON data file from the workspace
import pandas as pd
df = pd.read_csv('students.csv')   # if students.csv is open in a tab
```

Any curated packages required by loaded `.py` files are installed automatically.

### `input()` Dialog

Python's `input()` opens a styled modal dialog pre-filled with the prompt text from your program.  Type a value and press **OK** (or Enter) to continue; **Cancel** returns an empty string.  Standard Python code works unchanged — no `await` keywords required in student scripts.

### Algorithms Reference

Click **📚 Algorithm Challenges** in the toolbar to open a sliding drawer containing teaching examples and student challenges drawn from *The Little Book of Algorithms 2.0* by William Lau (CC BY-NC-SA 4.0).  Each entry includes:

- A description and teaching notes
- Annotated example code
- One or more challenges with starter code

Click **Load into Editor →** on any example or challenge to transfer the code directly into the editor.  Use the search box or category filter chips to navigate the content.

### Resetting the Playground

Click **🔄 Reset** to restore the Hello World starter code and fully reinitialise the Python environment.  All installed packages are removed and Pyodide is restarted (the WASM bundle is browser-cached so reinitialisation takes only a few seconds).

---

## Project Structure

```
src/
  App.jsx                  # Root component — layout, workspace state, and modal wiring
  App.css                  # Application styles
  components/
    Toolbar.jsx            # Run / Load / Save / Packages / Reset / Algorithms bar
    FileTabs.jsx           # VS Code-style workspace file tab bar
    CodeEditor.jsx         # Monaco editor wrapper (language-aware)
    OutputPanel.jsx        # Tabbed Console + Graphics output panel
    LibraryManager.jsx     # Package installation modal
    SaveAsModal.jsx        # Save As filename dialog (single file or ZIP)
    ConfirmModal.jsx       # Generic confirmation dialog (used by Reset)
    InputModal.jsx         # Modal dialog for Python input() calls
    AlgorithmsDrawer.jsx   # Algorithms index drawer + full detail modal
    cmFloatAd.jsx          # College branding component
  hooks/
    usePyodide.js          # React hook managing the Pyodide instance
  utils/
    turtleApi.js           # Canvas-based turtle graphics backend
    fileHandling.js        # Multi-file load / ZIP save helpers (JSZip)
    packages.js            # Curated package list + auto-detect helpers
    algorithms.js          # Algorithm data (William Lau CC BY-NC-SA 4.0)
public/
  py_modules/
    turtle.py              # Python turtle module (calls JS canvas API via Pyodide bridge)
  scripts/
    test_builtins.py       # Standard library functionality test
    test_turtle.py         # Turtle graphics test
    test_matplotlib.py     # Matplotlib chart rendering test
    test_numpy.py          # NumPy test
    test_pandas.py         # Pandas test
    test_scipy.py          # SciPy test
    test_sklearn.py        # scikit-learn test
    test_sympy.py          # SymPy test
    test_networkx.py       # NetworkX test
    test_pillow.py         # Pillow image processing test
    test_openpyxl.py       # OpenPyXL in-memory workbook test
    demo_csv_pandas.py     # Multi-file workspace demo — reads students.csv with Pandas
    students.csv           # Sample dataset used by demo_csv_pandas.py
```

---

## How Turtle Graphics Works

The turtle implementation is a two-layer canvas architecture:

1. **Offscreen canvas** — permanent strokes are drawn here so they persist across frames.
2. **Visible canvas** — composites the offscreen drawing and the live turtle cursor on every update.

`turtle.py` (in `public/py_modules/`) is a Python module injected into Pyodide's virtual filesystem.  It calls JavaScript functions (`window._turtle_draw_line`, `window._turtle_update_turtle`, etc.) via Pyodide's JS bridge.  This means full Python `turtle` semantics work without any server-side rendering.

The turtle canvas is hidden when no drawing has taken place in the current run, so matplotlib-only scripts do not show an empty canvas above their charts.

---

## How Matplotlib Rendering Works

Matplotlib is configured to use the `Agg` (non-GUI) backend via `os.environ['MPLBACKEND'] = 'Agg'` at Pyodide initialisation time.  Before each run, `plt.show()` is replaced with a capture function that saves every open figure to a base64-encoded PNG buffer.  After the run, any figures not explicitly shown are also captured.  The resulting images are passed back to React and rendered in the Graphics tab.

The return value from Pyodide's `runPythonAsync` is only captured when the **last top-level statement** in the code string is a bare expression — not a `try/except` block.  All harvest code is structured accordingly.

---

## Supported Packages (curated list)

| Package | Import name | Category |
|---|---|---|
| NumPy | `numpy` | Science |
| Pandas | `pandas` | Science |
| Matplotlib | `matplotlib` | Science |
| SciPy | `scipy` | Science |
| scikit-learn | `sklearn` | Science |
| NetworkX | `networkx` | Science |
| SymPy | `sympy` | Maths |
| OpenPyXL | `openpyxl` | Data |
| Pillow | `PIL` | Media |

Additional packages can be installed via `micropip` if not listed above.

> **File I/O in the workspace:** Upload `.csv` or `.json` files using the `+` tab button.  They are written to `/workspace/` before each run, so `open('data.csv')` works without any path prefix.  OpenPyXL scripts that need to create `.xlsx` files should use `io.BytesIO` for in-memory workbooks rather than writing to disk.  Pillow images should be displayed via Matplotlib rather than saved to disk.

---

## Linting

```bash
npm run lint
```

Uses ESLint with the `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh` plugins.

---

## Changelog

### v0.0.3 — 2026-05-28

**New features**

- **Multi-file workspace** — VS Code-style file tab bar above the editor.  Students can open multiple `.py`, `.csv`, and `.json` files simultaneously.  The `+` button adds a file without replacing the current workspace; individual tabs can be closed when no longer needed.
- **ZIP load / save** — loading a `.zip` file unpacks all text files into the workspace in one step.  Saving with multiple files open prompts for a project name and downloads a single `.zip` archive containing every workspace file (powered by JSZip).
- **Module and data file support** — all workspace files are written to `/workspace/` in Pyodide's MEMFS before each run; `/workspace/` is added to `sys.path` and set as the working directory.  Students can write `import helpers` or `open('data.csv')` using standard Python syntax with no extra setup.
- **`input()` modal** — Python's `input()` now opens a styled React modal dialog instead of the browser's native `window.prompt()`.  An AST transformer automatically rewrites `input(...)` calls to `await input(...)` in user code, and promotes any student-defined function containing an `input()` call to `async def`, so standard Python code works unchanged.
- **Algorithms drawer redesign** — replaced the accordion pattern with a master-detail layout: the drawer shows a compact searchable index; clicking any entry opens a full-width modal displaying the complete description, teaching notes, example code, and all challenges without any hidden scrolling.
- **Demo scripts** — `demo_csv_pandas.py` and `students.csv` added to `public/scripts/` demonstrating the multi-file workspace with a full Pandas analysis and Matplotlib visualisation.

**Changes**

- `SaveAsModal` no longer forces a `.py` extension — extension handling moved to `App.jsx` so both `.py` (single file) and `.zip` (multi-file) cases are handled correctly.
- `CodeEditor` accepts a `language` prop so `.json` and plain-text files render with appropriate Monaco syntax highlighting.
- Reset now clears all workspace files in addition to reinstalling Pyodide and removing packages.

### v0.0.2 — 2026-05-28

**New features**

- **Algorithms drawer** — sliding right-hand panel containing teaching examples and challenges from *The Little Book of Algorithms 2.0* by William Lau (CC BY-NC-SA 4.0).  Includes search, category filter chips, expandable cards with teaching notes, annotated code, and student challenges.  Code loads directly into the editor.
- **Save As modal** — replaces the browser `prompt()` with a proper dialog; pre-fills the current filename with the stem selected for easy overtyping; appends `.py` automatically.
- **Playground Reset** — confirmation modal then full Pyodide reinitialisation, clearing all installed packages and restoring the Hello World starter.
- **Auto-install on file load** — detects `import` statements in a loaded `.py` file, cross-references the curated package list, and installs any missing packages automatically.  Run is disabled until installation completes; progress is shown in the toolbar.
- **`turtle.window_width()` / `turtle.window_height()`** — added to the custom turtle module and `Screen` class.
- **Test scripts** — eleven `.py` scripts in `public/scripts/` covering every curated library and the Python standard library.

**Bug fixes**

- **Matplotlib graphics not rendering** — two root causes fixed: (1) the Agg backend was not being set when Matplotlib was installed after Pyodide initialised; resolved by setting `os.environ['MPLBACKEND'] = 'Agg'` at startup. (2) `plt.show()` with Agg closes figures before the post-run harvest; resolved by patching `plt.show` before each run to capture figures at call time. (3) Pyodide's `runPythonAsync` only returns a value when the last top-level statement is a bare expression — harvest code restructured accordingly.
- **Turtle canvas always visible** — canvas wrapper is now hidden when no turtle drawing occurred in the current run.
- **Bokeh removed** — Bokeh requires a live server or Selenium for PNG export, neither of which is available in a browser Pyodide environment; removed from the curated package list.

---

## Licence

Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International — see [LICENCE](LICENCE).

© 2026 Simon Rundell
