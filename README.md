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
| **guizero GUI** | `App`, `Box`, `Text`, `PushButton`, `TextBox`, `Drawing`, `Slider`, `Combo`, `ListBox`, `Picture`, `Waffle`, `MenuBar` — the simplified GUI library taught in UK GCSE/KS3 CS, reimplemented against the DOM; `from guizero import ...` works out of the box |
| **Matplotlib** | Charts rendered to PNG and displayed in the Graphics tab after `plt.show()` |
| **Package Manager** | One-click install of scientific packages (NumPy, Pandas, SciPy, scikit-learn, and more) via micropip |
| **Auto-install on Load** | Opening a `.py` file automatically detects and installs any required curated packages |
| **`input()` modal** | Python's `input()` opens a styled modal dialog; no native browser prompt |
| **Tabbed output** | Separate Console, Graphics and GUI tabs; auto-switches to Graphics or GUI when their respective output is produced |
| **Algorithms Drawer** | Sliding reference panel with searchable index and full-detail modal for each algorithm, from *The Little Book of Algorithms 2.0* by William Lau (CC BY-NC-SA 4.0) |
| **Python Basics Drawer** | Step-by-step beginner walkthrough — 18 topics from "What is a variable?" through turtle graphics, guizero GUIs, and NumPy/Pandas/Matplotlib, each with teaching notes, an example, and two challenges |
| **Playground Reset** | One-click reset clears all workspace files, restores Hello World, and fully reinitialises the Python environment |

---

## Tech Stack

- [React 19](https://react.dev/) + [Vite 8](https://vite.dev/) — UI framework and build tool
- [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react) — Monaco Editor integration
- [Pyodide 0.26.4](https://pyodide.org/) — CPython compiled to WebAssembly (loaded from CDN)
- [JSZip](https://stuk.github.io/jszip/) — ZIP archive creation and extraction
- HTML5 Canvas API — Turtle graphics rendering
- [guizero](https://lawsie.github.io/guizero/)-compatible DOM widget bridge — reimplemented from scratch, no external GUI library dependency

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

### guizero GUI apps

`guizero` is always available — no installation needed. It's the same simplified GUI library taught in UK GCSE/KS3 Computer Science (itself a wrapper around tkinter), reimplemented here directly against the DOM since real tkinter needs a display server a browser tab doesn't have.

```python
from guizero import App, Text, PushButton

app = App(title="Hello", width=250, height=120)
Text(app, text="Click the button")

def say_hi():
    greeting.value = "Hi there!"

greeting = Text(app, text="")
PushButton(app, command=say_hi, text="Greet")

app.display()
```

Output appears in the **GUI** tab automatically. `app.display()` behaves like it does in real guizero — it blocks the script until the app is stopped — so a **⏹ Stop** button appears on the GUI tab while it's running; press it to end the app and let the rest of the script (if any) continue.

`TextBox` reads and writes live — `.value` always reflects whatever's currently in the field, and its `command=` callback fires on every keystroke:

```python
from guizero import App, Text, TextBox

app = App(title="Greeter", width=300, height=150)
Text(app, text="What's your name?")

def update_greeting():
    greeting.value = f"Hello, {name_box.value or 'stranger'}!"

name_box = TextBox(app, command=update_greeting, width=20)
greeting = Text(app, text="Hello, stranger!")

app.display()
```

`Drawing` gives you a canvas for direct shapes and text — `line`, `oval`, `rectangle`, `triangle`, `polygon`, `text`, `clear`:

```python
from guizero import App, Drawing

app = App(title="Shapes", width=250, height=200)
canvas = Drawing(app, width=220, height=150)

canvas.rectangle(10, 10, 100, 80, color="#8bc34a")
canvas.oval(120, 10, 200, 80, color="#ffd54f")
canvas.text(10, 100, "Shapes!", color="#1a3a5c", size=14)

app.display()
```

`Slider`, `Combo` and `ListBox` all follow guizero's convention of calling `command` with the widget's new value automatically — no `args=` needed, unlike `PushButton`/`TextBox`:

```python
from guizero import App, Text, Slider, Combo, ListBox

app = App(title="Pick one", width=260, height=300)

def on_slide(value):
    slider_label.value = str(value)

Text(app, text="Volume")
slider_label = Text(app, text="50")
Slider(app, start=0, end=100, command=on_slide)

Text(app, text="Size")
Combo(app, options=["Small", "Medium", "Large"], selected="Medium")

Text(app, text="Toppings")
ListBox(app, items=["Cheese", "Pepperoni", "Olives"], multiselect=True, height=3)

app.display()
```

`ListBox` renders as a real scrollable list (via `<select size="N">`), not a dropdown — closer to how guizero's own tkinter Listbox looks than an HTML `<select>` would by default. With `multiselect=True`, `.value` returns a list; otherwise it returns a single item (or `None` if nothing is selected).

`Waffle` gives you a grid of clickable coloured squares — good for pixel art, simple grid-based games, or visualising 2D data. Its `command` is called with the `(x, y)` of the clicked pixel:

```python
from guizero import App, Waffle

app = App(title="Pixels", width=220, height=220)

def toggle(x, y):
    current = grid.get_pixel(x, y)
    grid.set_pixel(x, y, "white" if current == "blue" else "blue")

grid = Waffle(app, width=8, height=8, dim=20, command=toggle)

app.display()
```

`MenuBar` adds a dropdown menu bar, always docked to the top of the app regardless of where in the script it's constructed or what layout the app uses:

```python
from guizero import App, Text, MenuBar

app = App(title="Menus", width=280, height=140)
status = Text(app, text="Pick a menu item")

def choose(label):
    return lambda: setattr(status, "value", f"You chose: {label}")

MenuBar(app, toplevel=["File"], options=[[("New", choose("New")), None, ("Quit", choose("Quit"))]])

app.display()
```

`None` in an `options` list is a separator, matching real guizero.

`Picture` displays a PIL Image object directly, or a filename a script has already saved into `/workspace/` (e.g. via `image.save("photo.png")`) — there's no general image-upload UI in this playground (the workspace only accepts `.py`/`.csv`/`.json`), so a bare filename pointing at a file the student hasn't created themselves won't work, and arbitrary URLs are deliberately not supported:

```python
from PIL import Image, ImageDraw
from guizero import App, Picture

img = Image.new("RGB", (150, 100), "white")
ImageDraw.Draw(img).ellipse([10, 10, 140, 90], fill="#4caf50")

app = App(title="Picture", width=200, height=150)
Picture(app, image=img)

app.display()
```

**Widget set so far:** `App`, `Box`, `Text`, `PushButton`, `TextBox`, `Drawing`, `Slider`, `Combo`, `ListBox`, `Picture`, `Waffle`, `MenuBar`, with `layout="auto"` (stacked) or `layout="grid"` (using each widget's `grid=[column, row]`). Not yet supported: multiple windows. `Drawing.image()` is a no-op stub — there's no image-loading pipeline in this playground. Unrecognised keyword arguments are accepted and silently ignored rather than raising, so tutorials using not-yet-supported options degrade gracefully instead of crashing.

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

### Python Basics Walkthrough

Click **🔰 Python Basics** in the toolbar to open a second sliding drawer — a systematic, beginner-friendly introduction to Python for students who haven't coded before. It uses the same drawer/detail-modal mechanism as the Algorithms drawer (opening one closes the other) and covers 18 topics in teaching order, grouped into categories:

- **Basics** — What is a variable?, Data types & casting, Numbers & operators, Strings & f-strings, print() and input()
- **Logic** — Booleans & comparison operators, if/elif/else
- **Loops** — for loops, while loops
- **Collections** — Lists, Dictionaries, Tuples & Sets
- **Functions & Errors** — Functions, try/except error handling
- **Files** — Reading & writing files
- **Graphics & GUIs** — Turtle graphics, GUIs with guizero (tkinter)
- **Data Science** — Intro to NumPy, Pandas & Matplotlib

Each topic includes teaching notes, an annotated example, and two challenges with starter code — several of the foundational topics (variables, data types, lists, dictionaries, for loops, functions) also include a small inline diagram. As with the Algorithms drawer, **Load into Editor →** and **Load Starter Code →** transfer code straight into the active file.

### Resetting the Playground

Click **🔄 Reset** to restore the Hello World starter code and fully reinitialise the Python environment.  All installed packages are removed and Pyodide is restarted (the WASM bundle is browser-cached so reinitialisation takes only a few seconds).

---

## Project Structure

```
src/
  App.jsx                  # Root component — layout, workspace state, and modal wiring
  App.css                  # Application styles
  components/
    Toolbar.jsx            # Run / Load / Save / Packages / Python Basics / Algorithms / Reset bar
    FileTabs.jsx           # VS Code-style workspace file tab bar
    CodeEditor.jsx         # Monaco editor wrapper (language-aware)
    OutputPanel.jsx        # Tabbed Console + Graphics + GUI output panel
    LibraryManager.jsx     # Package installation modal
    SaveAsModal.jsx        # Save As filename dialog (single file or ZIP)
    ConfirmModal.jsx       # Generic confirmation dialog (used by Reset)
    InputModal.jsx         # Modal dialog for Python input() calls
    TeachingDrawer.jsx     # Generic sliding drawer + detail modal shared by both teaching drawers below
    AlgorithmsDrawer.jsx   # Algorithms index (thin wrapper around TeachingDrawer)
    PythonBasicsDrawer.jsx # Beginner Python walkthrough (thin wrapper around TeachingDrawer)
    cmFloatAd.jsx          # College branding component
  hooks/
    usePyodide.js          # React hook managing the Pyodide instance
  utils/
    turtleApi.js           # Canvas-based turtle graphics backend
    guiApi.js               # DOM-based widget host for the guizero bridge
    fileHandling.js        # Multi-file load / ZIP save helpers (JSZip)
    packages.js            # Curated package list + auto-detect helpers
    algorithms.js          # Algorithm data (William Lau CC BY-NC-SA 4.0)
    pythonBasics.js         # Beginner Python curriculum data (variables → NumPy/Pandas/Matplotlib)
public/
  py_modules/
    turtle.py              # Python turtle module (calls JS canvas API via Pyodide bridge)
    guizero.py              # Python guizero module (calls JS DOM widget API via Pyodide bridge)
  scripts/
    test_builtins.py       # Standard library functionality test
    test_turtle.py         # Turtle graphics test
    test_guizero.py        # guizero combined test — every Phase 1-3 widget in one app
    demo_guizero_counter.py # guizero GUI demo — a simple +1/-1 counter app
    demo_guizero_textbox.py # guizero GUI demo — live TextBox-to-Text binding
    demo_guizero_drawing.py # guizero GUI demo — Drawing canvas shapes and text
    demo_guizero_selectors.py # guizero GUI demo — Slider, Combo, multiselect ListBox
    demo_guizero_waffle.py  # guizero GUI demo — clickable Waffle pixel grid
    demo_guizero_menubar.py # guizero GUI demo — MenuBar dropdown menus
    demo_guizero_picture.py # guizero GUI demo — Picture from a PIL Image
    test_matplotlib.py     # Matplotlib chart rendering test
    test_numpy.py          # NumPy test
    test_pandas.py         # Pandas test
    test_scipy.py          # SciPy test
    test_sklearn.py        # scikit-learn test
    test_sympy.py          # SymPy test
    test_networkx.py       # NetworkX test
    test_pillow.py         # Pillow image processing test
    test_openpyxl.py       # OpenPyXL in-memory workbook test
    test_sqlite3.py        # SQLite3 in-memory database test
    test_ssl.py            # ssl context/protocol test
    test_lzma.py           # lzma compression round-trip test
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

## How the guizero GUI Works

Real tkinter (what guizero normally wraps) needs an actual display server, which a browser tab doesn't have — so `guizero.py` (in `public/py_modules/`) reimplements the guizero API directly against the DOM instead of delegating to tkinter. `guiApi.js` owns a container element React mounts in the GUI tab and creates/updates real `<div>`/`<span>`/`<button>` elements in response to calls from Python (`window._gui_create_box`, `window._gui_create_button`, etc.) — there's no virtual DOM here, Python manipulates real elements directly, the same way turtle draws directly onto its canvas.

The interesting problem is `app.display()`: in real guizero this call blocks until the window closes, and clicking a button while it's blocked has to call back into the still-running script. A one-shot "run to completion" interpreter can't do that, so `app.display()` is rewritten to `await app.display()` by the same AST transformer that already handles `input()` — it recognises calls to a method named `display` and wraps them in `await`, promoting the enclosing function to `async def` as needed. `display()` then awaits a JavaScript Promise that only resolves when the **⏹ Stop** button is pressed (or `App.destroy()` is called), which cooperatively yields control back to the browser's event loop — letting button clicks fire and call back into Python — without freezing the tab.

Button and TextBox `command=` callbacks are kept alive across multiple events using `pyodide.ffi.create_proxy`; those proxies are explicitly destroyed before each new Run (and on Playground Reset) to avoid leaking references between scripts. `TextBox.value` is read live from the DOM input on every access rather than cached in Python, since the student may have typed since Python last touched the widget. `Drawing` widgets hold their own 2D canvas context and draw immediately on each method call, the same direct-drawing approach `turtle.py` already uses — no virtual scene graph, no batching.

`Slider`, `Combo` and `ListBox` follow guizero's own convention: their `command` proxy is called directly with the widget's new value (a JS number, string, or array, auto-converted by Pyodide into a Python int/str/list) rather than through the no-args wrapper `PushButton`/`TextBox` use — there's no `args=` support for these three, matching real guizero. `ListBox` is a native `<select size="N">` rather than a dropdown, which is what gives it guizero's always-visible scrollable-list look without any custom rendering.

`MenuBar` needed a small architecture change: the GUI tab's root element now holds two children — an empty `menuBarSlot` (populated only if `MenuBar()` is called) and the actual `layoutContainer` that every other widget's `grid=`/`layout=` positioning applies to. `MenuBar()` always inserts into `menuBarSlot`, so it renders docked to the top regardless of when in the script it's constructed or whether the app uses `layout="auto"` or `layout="grid"` — it never has to compete for a grid cell with a widget a student explicitly placed at `grid=[0, 0]`. Because a MenuBar's item callbacks can't be handed across the Pyodide bridge as one nested Python structure (a dict containing a `PyProxy` function isn't JSON-serialisable, and Pyodide won't auto-convert nested containers), it's built incrementally instead — one bridge call for the bar itself, one per top-level menu, one per item — mirroring the flat-arguments style every other widget already uses.

`Picture` and `Drawing.image()` share the same constraint: this playground has no general image-upload pipeline (workspace uploads are `.py`/`.csv`/`.json` only), so `Picture.image=` only accepts a PIL Image object (converted to a PNG data URI the same way matplotlib figures are captured) or a filename already sitting in Pyodide's `/workspace/` virtual filesystem — not an arbitrary URL, which was a deliberate choice to avoid the playground loading external content.

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
| SQLite3 | `sqlite3` | Data |
| SSL | `ssl` | Data |
| LZMA | `lzma` | Data |

Additional packages can be installed via `micropip` if not listed above.

> **Standard library note:** most of the Python standard library (`time`, `os`, `re`, `json`, `csv`, `datetime`, `hashlib`, `threading`, `pathlib`, and many more) works with no installation at all — it ships as part of the Pyodide runtime. A handful of modules are "unvendored" for size reasons and need an explicit install even though they're stdlib — `sqlite3`, `ssl`, and `lzma` are the ones students are likely to hit, and they're in the curated list above for that reason. `tkinter`, `curses`, and `readline` cannot work in a browser sandbox at all (no display server or terminal) and are not supported.

> **File I/O in the workspace:** Upload `.csv` or `.json` files using the `+` tab button.  They are written to `/workspace/` before each run, so `open('data.csv')` works without any path prefix.  OpenPyXL scripts that need to create `.xlsx` files should use `io.BytesIO` for in-memory workbooks rather than writing to disk.  Pillow images should be displayed via Matplotlib rather than saved to disk.

---

## Linting

```bash
npm run lint
```

Uses ESLint with the `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh` plugins.

---

## Changelog

### v0.0.12 — 2026-09-25

**New features**

- **Python Basics: Turtle graphics & GUIs with guizero (tkinter)** — two new topics in a new "Graphics & GUIs" category, covering turtle drawing (loops, angles, fill) and building a simple guizero app (App/Text/PushButton/TextBox), each with teaching notes, a working example and two challenges. Explicitly explains why `import tkinter` doesn't work in a browser tab and how guizero fills that gap.

**Bug fixes**

- **`turtle.end_fill()` crashed with `UnboundLocalError`** — found while writing the new Turtle graphics example. `_fill_path` was reassigned inside `end_fill()` without being declared `global`, so Python treated it as an unbound local on the read one line above. Any script calling `begin_fill()`/`end_fill()` (directly or via the `Turtle` class) was affected — a real pre-existing bug, not caused by this change.

### v0.0.11 — 2026-09-25

**New features**

- **guizero `Picture`, `Waffle`, `MenuBar` (Phase 5)** — completes the originally scoped guizero widget set. `Waffle` is a grid of clickable coloured squares (`command` called with the clicked `(x, y)`) for pixel art and grid-based exercises. `MenuBar` adds dropdown menus always docked to the top of the app, regardless of construction order or layout mode — built via incremental bridge calls since a nested Python structure holding `PyProxy` callbacks can't cross the Pyodide bridge as one argument. `Picture` displays a PIL Image object or a `/workspace/` filename (no arbitrary URLs — there's no general image-upload pipeline in this playground yet). Added `demo_guizero_waffle.py`, `demo_guizero_menubar.py`, `demo_guizero_picture.py`.
- This completes the originally scoped Phase 1–5 guizero build.

### v0.0.10 — 2026-09-25

**New features**

- **guizero `Slider`, `Combo`, `ListBox` (Phase 4)** — `Slider` (a range input), `Combo` (a dropdown), and `ListBox` (a native scrollable `<select size="N">`, with `multiselect=True` returning a list from `.value`). All three call their `command` with the widget's new value automatically, matching real guizero's convention for these widgets (no `args=`, unlike `PushButton`/`TextBox`). Added `public/scripts/demo_guizero_selectors.py` (a pizza-order form exercising all three together).

### v0.0.9 — 2026-09-24

**New features**

- **guizero `Drawing` (Phase 3)** — a canvas widget for direct shapes and text: `line`, `oval`, `rectangle`, `triangle`, `polygon`, `text`, `clear`. Each Drawing widget owns its own 2D canvas context and draws immediately on each call, the same direct-drawing approach `turtle.py` already uses. `Drawing.image()` is a no-op stub (no image-loading pipeline). Added `public/scripts/demo_guizero_drawing.py`.
- This completes the originally scoped Phase 1–3 guizero build: `App`, `Box`, `Text`, `PushButton`, `TextBox`, `Drawing`, both layout modes, and the Stop-button `display()` bridge.

### v0.0.8 — 2026-09-24

**New features**

- **guizero `TextBox` (Phase 2)** — single-line and multiline (`multiline=True`) text entry, with `.value` read live from the DOM (not cached) so it always reflects what the student has typed, and a `command=` callback that fires on every keystroke, matching real guizero. Added `public/scripts/demo_guizero_textbox.py`.

### v0.0.7 — 2026-09-24

**New features**

- **guizero GUI apps (Phase 1)** — `from guizero import App, Box, Text, PushButton` now works with no installation. guizero is the simplified GUI library taught in UK GCSE/KS3 Computer Science (a wrapper around tkinter); since real tkinter needs a display server a browser can't provide, this is a from-scratch reimplementation against the DOM that runs real guizero code for the supported widget subset unmodified. `App.display()` cooperatively blocks the script (via the same AST-rewrite mechanism already used for `input()`) until a new **⏹ Stop** button on the new **GUI** output tab is pressed, letting button clicks call back into the still-running script. `layout="auto"` and `layout="grid"` (with per-widget `grid=[column, row]`) are both supported. Added `public/py_modules/guizero.py`, `src/utils/guiApi.js`, and `public/scripts/demo_guizero_counter.py`.
- Not yet supported: `TextBox`, `Drawing`, `Slider`, `ListBox`, `Combo`, `Picture`, `MenuBar`, multiple windows — planned for later phases.

### v0.0.6 — 2026-09-24

**New features**

- **`sqlite3`, `ssl`, and `lzma` added to the curated package list** — these are standard-library modules but Pyodide "unvendors" them for size reasons, so `import sqlite3` (etc.) fails until explicitly installed via `pyodide.loadPackage()`. They now show up in **📦 Packages** (Data category) and auto-install when detected in a loaded `.py` file, same as any other curated package. Added `test_sqlite3.py`, `test_ssl.py`, and `test_lzma.py` to `public/scripts/`.
- **README standard-library note** — clarified which stdlib modules need no install at all (`time` included — it already worked; a student report of it failing to import could not be reproduced) versus the handful that do (`sqlite3`, `ssl`, `lzma`), and flagged `tkinter`/`curses`/`readline` as unsupported in a browser sandbox.

### v0.0.5 — 2026-09-15

**New features**

- **Python Basics drawer** — a second sliding drawer (🔰 Python Basics, beside 📚 Algorithm Challenges) offering a systematic, beginner-friendly walkthrough of Python: 16 topics from "What is a variable?" through to a first look at NumPy, Pandas and Matplotlib, each with teaching notes, an annotated example, two challenges, and — for the foundational topics — a small inline SVG diagram. Opening one drawer closes the other.
- **Shared `TeachingDrawer` component** — the drawer/search/category-filter/detail-modal UI used by the Algorithms drawer was generalised into a reusable component, configured via props, so both drawers share one implementation. `AlgorithmsDrawer.jsx` and `PythonBasicsDrawer.jsx` are now thin, content-specific wrappers around it.
- **Resizable editor/output split** — a draggable divider between the code editor and the output panel, clamped between 20% and 80% width.
- **New tab button creates a blank file** — the `+` button in the workspace tab bar now creates a uniquely-named blank `.py` file directly, instead of opening the file-picker dialog (use the toolbar's **Load** button to open a file from disk).

**Changes**

- `cmFloatAd.jsx` branding banner updated with a clearer logo and the current department name; kept fully self-contained (inline styles only) so it can be dropped into other projects unchanged.

### v0.0.4 — 2026-07-12

**Bug fixes**

- **Files written by student code now show up in the editor** — `runCode` synced workspace files into Pyodide's virtual filesystem before each run, but never read them back afterwards, so `open('file.txt', 'w').write(...)` succeeded inside the sandbox while the editor kept showing the stale pre-run content. `usePyodide.js` now reads `/workspace/` back out of the virtual FS after every run and `App.jsx` merges the result into workspace state, so writes (and brand-new files created by a script) appear immediately, including their own file tab.

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
