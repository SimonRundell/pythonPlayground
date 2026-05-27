/**
 * @file turtleApi.js - Canvas-based turtle graphics backend.
 *
 * Exposes window._turtle_* functions that the Python turtle.py module
 * calls via Pyodide's JS bridge (from js import _turtle_draw_line, etc.)
 *
 * Uses two layered canvases:
 *   drawingCanvas  – offscreen CanvasRenderingContext2D for persistent strokes
 *   visibleCanvas  – the DOM canvas; composites drawing + live turtle cursor
 *
 * @license Creative Commons BY-NC-SA 4.0 - Simon Rundell
 */

let visibleCanvas = null
let drawCtx = null   // offscreen context for permanent drawing
let drawCanvas = null
let dispCtx = null   // display context (visible canvas)

let bgColor = '#ffffff'
let turtleX = 0
let turtleY = 0
let turtleHeading = 0  // degrees, 0=east, counter-clockwise positive
let turtleVisible = true
let turtleColor = '#000000'
let turtleWasUsed = false

/** Composite the offscreen drawing + turtle cursor onto the visible canvas. */
function render() {
  if (!visibleCanvas) return
  const w = visibleCanvas.width
  const h = visibleCanvas.height

  dispCtx.fillStyle = bgColor
  dispCtx.fillRect(0, 0, w, h)
  dispCtx.drawImage(drawCanvas, 0, 0)

  if (turtleVisible) {
    drawCursor(dispCtx, w / 2 + turtleX, h / 2 - turtleY, turtleHeading, turtleColor)
  }
}

/** Draw the turtle cursor triangle. */
function drawCursor(ctx, cx, cy, headingDeg, color) {
  const size = 14
  const rad = (headingDeg * Math.PI) / 180

  // Tip of arrow
  const tipX = cx + size * Math.cos(rad)
  const tipY = cy - size * Math.sin(rad)

  // Back centre
  const backX = cx - size * 0.55 * Math.cos(rad)
  const backY = cy + size * 0.55 * Math.sin(rad)

  // Wing perpendicular
  const wingRad = rad + Math.PI / 2
  const half = size * 0.55
  const lx = backX + half * Math.cos(wingRad)
  const ly = backY - half * Math.sin(wingRad)
  const rx = backX - half * Math.cos(wingRad)
  const ry = backY + half * Math.sin(wingRad)

  ctx.save()
  ctx.beginPath()
  ctx.moveTo(tipX, tipY)
  ctx.lineTo(lx, ly)
  ctx.lineTo(rx, ry)
  ctx.closePath()
  ctx.fillStyle = color || '#000000'
  ctx.fill()
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.restore()
}

/**
 * Initialise the turtle API against a specific canvas DOM element.
 * Call this once the canvas is mounted in React.
 * @param {HTMLCanvasElement} canvas
 */
export function initTurtleApi(canvas) {
  visibleCanvas = canvas
  dispCtx = canvas.getContext('2d')

  // Offscreen drawing surface
  drawCanvas = document.createElement('canvas')
  drawCanvas.width = canvas.width
  drawCanvas.height = canvas.height
  drawCtx = drawCanvas.getContext('2d')

  registerGlobals()
  window._turtle_reset()
}

/** Register all window._turtle_* functions used by the Python module. */
function registerGlobals() {
  window._turtle_canvas_width = () => visibleCanvas ? visibleCanvas.width : 800
  window._turtle_canvas_height = () => visibleCanvas ? visibleCanvas.height : 600

  window._turtle_reset = () => {
    turtleWasUsed = false
    turtleX = 0
    turtleY = 0
    turtleHeading = 0
    turtleVisible = true
    turtleColor = '#000000'
    bgColor = '#ffffff'
    if (drawCtx && visibleCanvas) {
      drawCtx.clearRect(0, 0, visibleCanvas.width, visibleCanvas.height)
      render()
    }
  }

  window._turtle_clear = () => {
    if (drawCtx && visibleCanvas) {
      drawCtx.clearRect(0, 0, visibleCanvas.width, visibleCanvas.height)
      render()
    }
  }

  /**
   * Draw a line segment on the offscreen canvas.
   * @param {number} x1 @param {number} y1 @param {number} x2 @param {number} y2
   * @param {string} color @param {number} lineWidth
   */
  window._turtle_draw_line = (x1, y1, x2, y2, color, lineWidth) => {
    if (!drawCtx) return
    turtleWasUsed = true
    drawCtx.save()
    drawCtx.beginPath()
    drawCtx.moveTo(x1, y1)
    drawCtx.lineTo(x2, y2)
    drawCtx.strokeStyle = color || '#000000'
    drawCtx.lineWidth = lineWidth || 1
    drawCtx.lineCap = 'round'
    drawCtx.stroke()
    drawCtx.restore()
    render()
  }

  /**
   * Draw a filled dot.
   * @param {number} cx @param {number} cy @param {number} radius @param {string} color
   */
  window._turtle_draw_dot = (cx, cy, radius, color) => {
    if (!drawCtx) return
    turtleWasUsed = true
    drawCtx.save()
    drawCtx.beginPath()
    drawCtx.arc(cx, cy, radius, 0, Math.PI * 2)
    drawCtx.fillStyle = color || '#000000'
    drawCtx.fill()
    drawCtx.restore()
    render()
  }

  /**
   * Fill a polygon from a JSON-encoded flat [x1,y1,x2,y2,...] array.
   * @param {string} flatJson @param {string} color
   */
  window._turtle_fill_polygon = (flatJson, color) => {
    if (!drawCtx) return
    turtleWasUsed = true
    const pts = JSON.parse(flatJson)
    if (pts.length < 4) return
    drawCtx.save()
    drawCtx.beginPath()
    drawCtx.moveTo(pts[0], pts[1])
    for (let i = 2; i < pts.length; i += 2) {
      drawCtx.lineTo(pts[i], pts[i + 1])
    }
    drawCtx.closePath()
    drawCtx.fillStyle = color || '#000000'
    drawCtx.fill()
    drawCtx.restore()
    render()
  }

  /**
   * Draw text at the given canvas position.
   * @param {number} x @param {number} y @param {string} text
   * @param {string} color @param {string} font @param {string} align
   */
  window._turtle_draw_text = (x, y, text, color, font, align) => {
    if (!drawCtx) return
    turtleWasUsed = true
    drawCtx.save()
    drawCtx.font = font || '12px Arial'
    drawCtx.fillStyle = color || '#000000'
    drawCtx.textAlign = align || 'left'
    drawCtx.textBaseline = 'top'
    drawCtx.fillText(String(text), x, y)
    drawCtx.restore()
    render()
  }

  /**
   * Update the turtle cursor position and heading, then re-render.
   * @param {number} x  turtle-space x
   * @param {number} y  turtle-space y
   * @param {number} heading  degrees (0=east, CCW positive)
   * @param {boolean} visible
   * @param {string} [color]
   */
  window._turtle_update_turtle = (x, y, heading, visible, color) => {
    turtleX = x
    turtleY = y
    turtleHeading = heading
    turtleVisible = visible
    if (color) turtleColor = color
    render()
  }

  /** Change canvas background colour. */
  window._turtle_bgcolor = (color) => {
    bgColor = color
    render()
  }

  /** Return whether any turtle drawing happened since last reset. */
  window._turtle_was_used = () => turtleWasUsed
}
