# Python Playground

A browser-based Python IDE that runs entirely client-side — no server, no installation, no Python runtime required on the host machine.  Built for use in Further Education classrooms where students need an immediate, zero-friction Python environment.

---

## Features

| Feature | Details |
|---|---|
| **Monaco Editor** | VS Code-quality editor with Python syntax highlighting, bracket colouring, and autocompletion |
| **Pyodide (CPython in WASM)** | Full CPython 3.x interpreter compiled to WebAssembly — code runs in the browser tab |
| **Turtle Graphics** | Custom canvas-based turtle backend; `import turtle` works out of the box |
| **Matplotlib** | Charts rendered to PNG and displayed in the Graphics tab after `plt.show()` |
| **Package Manager** | One-click install of scientific packages (NumPy, Pandas, SciPy, scikit-learn, and more) via micropip |
| **File Load / Save** | Open and save `.py` files directly from/to the local filesystem |
| **`input()` support** | `input()` uses the browser's native `prompt()` dialog |
| **Tabbed output** | Separate Console and Graphics tabs; auto-switches to Graphics when turtle or matplotlib output is produced |

---

## Tech Stack

- [React 19](https://react.dev/) + [Vite 8](https://vite.dev/) — UI framework and build tool
- [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react) — Monaco Editor integration
- [Pyodide 0.26.4](https://pyodide.org/) — CPython compiled to WebAssembly (loaded from CDN)
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

Output appears in the **Graphics** tab automatically.

### Matplotlib

```python
import matplotlib.pyplot as plt

plt.plot([1, 2, 3, 4])
plt.title("My Chart")
plt.show()
```

The chart is rendered to PNG and shown in the **Graphics** tab.

### Installing Packages

Click **📦 Packages** in the toolbar and select the packages your program needs.  Packages are downloaded once per browser session.

### Loading and Saving Files

- **📂 Load** — opens a file picker to load a `.py` file into the editor.
- **💾 Save** — saves the current editor contents as a `.py` file.

---

## Project Structure

```
src/
  App.jsx                  # Root component — layout and state wiring
  App.css                  # Application styles
  components/
    Toolbar.jsx            # Run / Load / Save / Packages action bar
    CodeEditor.jsx         # Monaco editor wrapper
    OutputPanel.jsx        # Tabbed Console + Graphics output panel
    LibraryManager.jsx     # Package installation modal
    cmFloatAd.jsx          # College branding component
  hooks/
    usePyodide.js          # React hook managing the Pyodide instance
  utils/
    turtleApi.js           # Canvas-based turtle graphics backend
    fileHandling.js        # File load / save helpers
    packages.js            # Curated installable package list
public/
  py_modules/
    turtle.py              # Python turtle module (calls JS canvas API via Pyodide bridge)
```

---

## How Turtle Graphics Works

The turtle implementation is a two-layer canvas architecture:

1. **Offscreen canvas** — permanent strokes are drawn here so they persist across frames.
2. **Visible canvas** — composites the offscreen drawing and the live turtle cursor on every update.

`turtle.py` (in `public/py_modules/`) is a Python module injected into Pyodide's virtual filesystem.  It calls JavaScript functions (`window._turtle_draw_line`, `window._turtle_update_turtle`, etc.) via Pyodide's JS bridge.  This means full Python `turtle` semantics work without any server-side rendering.

---

## Supported Packages (curated list)

| Package | Category |
|---|---|
| NumPy | Science |
| Pandas | Science |
| Matplotlib | Science |
| SciPy | Science |
| scikit-learn | Science |
| NetworkX | Science |
| Bokeh | Science |
| SymPy | Maths |
| OpenPyXL | Data |
| Pillow | Media |

Additional packages can be installed via `micropip` if not listed above.

---

## Linting

```bash
npm run lint
```

Uses ESLint with the `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh` plugins.

---

## Licence

Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International — see [LICENCE](LICENCE).

© 2025 Simon Rundell
