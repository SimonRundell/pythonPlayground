/**
 * @file guiApi.js - DOM-based widget host for the guizero bridge (guizero.py).
 *
 * Exposes window._gui_* functions that guizero.py calls via Pyodide's JS bridge
 * (from js import ...). Widgets are real DOM elements appended into a single
 * root container React mounts via a ref, mirroring turtleApi.js's canvas init
 * pattern. There is no virtual DOM here — Python calls create/update elements
 * directly, same as the turtle canvas is drawn on directly.
 *
 * App.display() cooperatively "blocks" by awaiting a Promise that only resolves
 * when Stop is pressed (or App.destroy() is called) — this is what lets button
 * clicks call back into the still-running Python script instead of freezing it.
 *
 * @license Creative Commons BY-NC-SA 4.0 - Simon Rundell
 */

let rootContainer = null
let onRunningChange = null   // (running: boolean) => void, informs React for the Stop button

let idCounter = 0
let guiWasUsed = false
let stopResolve = null

/** id -> { el: HTMLElement, proxy?: PyProxy } */
const widgets = new Map()
/** id ('root' or a Box id) -> its declared layout ('auto' | 'grid') */
const layouts = new Map()

function nextId() {
  idCounter += 1
  return `gui-${idCounter}`
}

/** Resolve a parent id ('root' or a Box id) to its DOM element. */
function containerFor(parentId) {
  if (parentId === 'root') return rootContainer
  const w = widgets.get(parentId)
  return w ? w.el : rootContainer
}

/** Resolve a Drawing widget id to its 2D canvas context. */
function drawingCtx(id) {
  const w = widgets.get(id)
  return w ? w.ctx : null
}

/** Apply a container's own layout style (governs how ITS children are arranged). */
function applyLayout(el, layout) {
  if (layout === 'grid') {
    el.style.display = 'grid'
    el.style.gap = '8px'
    el.style.justifyItems = 'center'
  } else {
    el.style.display = 'flex'
    el.style.flexDirection = 'column'
    el.style.alignItems = 'center'
    el.style.gap = '8px'
  }
}

/** Append a child into its parent, positioning it if the parent uses grid layout. */
function placeInParent(el, parentId, col, row) {
  const parentEl = containerFor(parentId)
  const parentLayout = layouts.get(parentId) || 'auto'
  if (parentLayout === 'grid' && col >= 0 && row >= 0) {
    el.style.gridColumn = String(col + 1)
    el.style.gridRow = String(row + 1)
  }
  if (parentEl) parentEl.appendChild(el)
}

/** Full state reset — clears widgets, destroys button proxies, ends any pending display(). */
function resetState() {
  if (stopResolve) {
    const resolve = stopResolve
    stopResolve = null
    resolve()
    if (onRunningChange) onRunningChange(false)
  }
  widgets.forEach((w) => {
    if (w.proxy && typeof w.proxy.destroy === 'function') w.proxy.destroy()
  })
  widgets.clear()
  layouts.clear()
  idCounter = 0
  guiWasUsed = false
  if (rootContainer) rootContainer.innerHTML = ''
}

/**
 * Initialise the GUI API against the container element React mounted.
 * Call this once the container is available, and again after Reset re-creates Pyodide.
 * @param {HTMLElement} container
 * @param {(running: boolean) => void} [runningChangeCb]
 */
export function initGuiApi(container, runningChangeCb) {
  rootContainer = container
  onRunningChange = runningChangeCb || null
  registerGlobals()
  resetState()
}

/** Register all window._gui_* functions used by the Python guizero module. */
function registerGlobals() {
  window._gui_app_init = (width, height, layout, bg) => {
    resetState()
    guiWasUsed = true
    if (rootContainer) {
      rootContainer.style.width = `${width}px`
      rootContainer.style.minHeight = `${height}px`
      rootContainer.style.background = bg || '#f5f5f5'
      applyLayout(rootContainer, layout)
    }
    layouts.set('root', layout)
  }

  window._gui_set_app_bg = (bg) => {
    if (rootContainer) rootContainer.style.background = bg || '#f5f5f5'
  }

  window._gui_create_box = (parentId, layout, border, col, row) => {
    const id = nextId()
    const el = document.createElement('div')
    el.className = 'gui-box'
    if (border) el.style.border = '1px solid #d0d7de'
    applyLayout(el, layout)
    placeInParent(el, parentId, col, row)
    widgets.set(id, { el })
    layouts.set(id, layout)
    return id
  }

  window._gui_create_text = (parentId, text, size, color, font, align, col, row) => {
    const id = nextId()
    const el = document.createElement('span')
    el.className = 'gui-text'
    el.textContent = text
    el.style.fontSize = `${Math.max(8, size + 4)}px`
    if (color) el.style.color = color
    if (font) el.style.fontFamily = font
    if (align) el.style.textAlign = align
    placeInParent(el, parentId, col, row)
    widgets.set(id, { el })
    return id
  }

  window._gui_set_text = (id, text) => {
    const w = widgets.get(id)
    if (w) w.el.textContent = text
  }

  window._gui_create_button = (parentId, text, onClick, col, row) => {
    const id = nextId()
    const el = document.createElement('button')
    el.type = 'button'
    el.className = 'gui-btn'
    el.textContent = text
    if (onClick) {
      el.addEventListener('click', () => {
        try {
          onClick()
        } catch (err) {
          console.error('guizero button handler error:', err)
        }
      })
    }
    placeInParent(el, parentId, col, row)
    widgets.set(id, { el, proxy: onClick })
    return id
  }

  window._gui_set_button_text = (id, text) => {
    const w = widgets.get(id)
    if (w) w.el.textContent = text
  }

  window._gui_set_enabled = (id, enabled) => {
    const w = widgets.get(id)
    if (w) w.el.disabled = !enabled
  }

  window._gui_get_enabled = (id) => {
    const w = widgets.get(id)
    return w ? !w.el.disabled : true
  }

  window._gui_create_textbox = (parentId, text, width, height, multiline, onChange, col, row) => {
    const id = nextId()
    const el = document.createElement(multiline ? 'textarea' : 'input')
    el.className = 'gui-textbox'
    if (!multiline) el.type = 'text'
    el.value = text || ''
    if (width) el.style.width = `${width}ch`
    if (multiline && height) el.rows = height
    if (onChange) {
      el.addEventListener('input', () => {
        try {
          onChange()
        } catch (err) {
          console.error('guizero textbox handler error:', err)
        }
      })
    }
    placeInParent(el, parentId, col, row)
    widgets.set(id, { el, proxy: onChange })
    return id
  }

  window._gui_get_text_value = (id) => {
    const w = widgets.get(id)
    return w ? w.el.value : ''
  }

  window._gui_set_text_value = (id, value) => {
    const w = widgets.get(id)
    if (w) w.el.value = value
  }

  window._gui_create_drawing = (parentId, width, height, col, row) => {
    const id = nextId()
    const el = document.createElement('canvas')
    el.className = 'gui-drawing'
    el.width = width
    el.height = height
    const ctx = el.getContext('2d')
    placeInParent(el, parentId, col, row)
    widgets.set(id, { el, ctx })
    return id
  }

  window._gui_drawing_line = (id, x1, y1, x2, y2, color, width) => {
    const ctx = drawingCtx(id)
    if (!ctx) return
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.strokeStyle = color || '#000000'
    ctx.lineWidth = width || 1
    ctx.lineCap = 'round'
    ctx.stroke()
    ctx.restore()
  }

  window._gui_drawing_oval = (id, x1, y1, x2, y2, color, outline) => {
    const ctx = drawingCtx(id)
    if (!ctx) return
    const cx = (x1 + x2) / 2
    const cy = (y1 + y2) / 2
    const rx = Math.abs(x2 - x1) / 2
    const ry = Math.abs(y2 - y1) / 2
    ctx.save()
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
    ctx.fillStyle = color || '#000000'
    ctx.fill()
    if (outline) {
      ctx.strokeStyle = outline
      ctx.lineWidth = 1
      ctx.stroke()
    }
    ctx.restore()
  }

  window._gui_drawing_rectangle = (id, x1, y1, x2, y2, color, outline) => {
    const ctx = drawingCtx(id)
    if (!ctx) return
    const x = Math.min(x1, x2)
    const y = Math.min(y1, y2)
    const w = Math.abs(x2 - x1)
    const h = Math.abs(y2 - y1)
    ctx.save()
    ctx.fillStyle = color || '#000000'
    ctx.fillRect(x, y, w, h)
    if (outline) {
      ctx.strokeStyle = outline
      ctx.lineWidth = 1
      ctx.strokeRect(x, y, w, h)
    }
    ctx.restore()
  }

  window._gui_drawing_polygon = (id, flatJson, color, outline) => {
    const ctx = drawingCtx(id)
    if (!ctx) return
    const pts = JSON.parse(flatJson)
    if (pts.length < 6) return
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(pts[0], pts[1])
    for (let i = 2; i < pts.length; i += 2) {
      ctx.lineTo(pts[i], pts[i + 1])
    }
    ctx.closePath()
    ctx.fillStyle = color || '#000000'
    ctx.fill()
    if (outline) {
      ctx.strokeStyle = outline
      ctx.lineWidth = 1
      ctx.stroke()
    }
    ctx.restore()
  }

  window._gui_drawing_text = (id, x, y, text, color, size, font) => {
    const ctx = drawingCtx(id)
    if (!ctx) return
    ctx.save()
    ctx.font = `${size}px ${font || 'Arial'}`
    ctx.fillStyle = color || '#000000'
    ctx.textBaseline = 'top'
    ctx.fillText(text, x, y)
    ctx.restore()
  }

  window._gui_drawing_clear = (id) => {
    const w = widgets.get(id)
    if (w && w.ctx) w.ctx.clearRect(0, 0, w.el.width, w.el.height)
  }

  /** Called by App.display() — resolves only when Stop is pressed or destroy() runs. */
  window._gui_await_stop = () => {
    if (onRunningChange) onRunningChange(true)
    return new Promise((resolve) => { stopResolve = resolve })
  }

  /** Called by the Stop button (and App.destroy()). */
  window._gui_request_stop = () => {
    if (!stopResolve) return
    const resolve = stopResolve
    stopResolve = null
    resolve()
    if (onRunningChange) onRunningChange(false)
  }

  /** Called before each Run — clears any widgets/state left over from a previous script. */
  window._gui_reset = () => resetState()

  /** Return whether any GUI widget has been created since the last reset. */
  window._gui_was_used = () => guiWasUsed
}
