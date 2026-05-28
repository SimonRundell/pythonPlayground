"""
turtle.py — Browser-compatible turtle graphics for Python Playground.

Replaces the standard library turtle module (which requires tkinter).
All drawing calls route through Pyodide's JS bridge to a canvas element.

Supported: forward/fd, backward/bk, right/rt, left/lt, penup/pu, pendown/pd,
  pencolor, fillcolor, color, begin_fill, end_fill, goto/setpos, setx, sety,
  setheading/seth, home, circle, dot, width/pensize, speed, hideturtle/ht,
  showturtle/st, isvisible, position/pos, xcor, ycor, heading, towards,
  distance, bgcolor, write, clear, reset, done/mainloop/exitonclick,
  Turtle class (OOP style), Screen class.

License: Creative Commons BY-NC-SA 4.0 — Simon Rundell
"""
import math
import json
import js  # Pyodide JS bridge

# ── Module-level turtle state ────────────────────────────────────────────────
_x = 0.0
_y = 0.0
_heading = 0.0     # degrees; 0 = east, CCW positive (standard turtle convention)
_pen_down = True
_pen_color = '#000000'
_fill_color = '#000000'
_pen_width = 1
_speed = 6
_visible = True
_filling = False
_fill_path = []    # list of (turtle_x, turtle_y) points for current fill

# ── Coordinate helpers ───────────────────────────────────────────────────────

def _cx(tx):
    """Convert turtle x to canvas x."""
    return js._turtle_canvas_width() / 2 + tx

def _cy(ty):
    """Convert turtle y to canvas y (y-axis is flipped)."""
    return js._turtle_canvas_height() / 2 - ty

# ── Core movement ────────────────────────────────────────────────────────────

def forward(distance):
    """Move the turtle forward by distance in the current heading direction."""
    global _x, _y
    rad = math.radians(_heading)
    nx = _x + distance * math.cos(rad)
    ny = _y + distance * math.sin(rad)
    if _pen_down:
        js._turtle_draw_line(_cx(_x), _cy(_y), _cx(nx), _cy(ny), _pen_color, _pen_width)
    _x, _y = nx, ny
    if _filling:
        _fill_path.append((_x, _y))
    js._turtle_update_turtle(_x, _y, _heading, _visible, _pen_color)

fd = forward

def backward(distance):
    """Move backward by distance."""
    forward(-distance)

bk = backward
back = backward

def right(angle):
    """Turn clockwise by angle degrees."""
    global _heading
    _heading = (_heading - angle) % 360
    js._turtle_update_turtle(_x, _y, _heading, _visible, _pen_color)

rt = right

def left(angle):
    """Turn counter-clockwise by angle degrees."""
    global _heading
    _heading = (_heading + angle) % 360
    js._turtle_update_turtle(_x, _y, _heading, _visible, _pen_color)

lt = left

# ── Pen control ──────────────────────────────────────────────────────────────

def penup():
    """Lift the pen — movement leaves no trail."""
    global _pen_down
    _pen_down = False

pu = penup
up = penup

def pendown():
    """Lower the pen — movement draws a line."""
    global _pen_down
    _pen_down = True

pd = pendown
down = pendown

def pencolor(*args):
    """Set the pen (stroke) colour.  Accepts a colour name/hex or (r,g,b)."""
    global _pen_color
    if len(args) == 1:
        _pen_color = str(args[0])
    elif len(args) == 3:
        r, g, b = args
        if isinstance(r, float) and r <= 1.0:
            r, g, b = int(r * 255), int(g * 255), int(b * 255)
        _pen_color = f'#{int(r):02x}{int(g):02x}{int(b):02x}'

def fillcolor(*args):
    """Set the fill colour.  Accepts a colour name/hex or (r,g,b)."""
    global _fill_color
    if len(args) == 1:
        _fill_color = str(args[0])
    elif len(args) == 3:
        r, g, b = args
        if isinstance(r, float) and r <= 1.0:
            r, g, b = int(r * 255), int(g * 255), int(b * 255)
        _fill_color = f'#{int(r):02x}{int(g):02x}{int(b):02x}'

def color(*args):
    """Set pen and (optionally) fill colour together."""
    if len(args) == 1:
        pencolor(args[0])
        fillcolor(args[0])
    elif len(args) == 2:
        pencolor(args[0])
        fillcolor(args[1])

def width(w=None):
    """Get or set pen width in pixels."""
    global _pen_width
    if w is not None:
        _pen_width = w
    return _pen_width

pensize = width

def speed(s=None):
    """Get or set drawing speed (no visual effect in browser — kept for compatibility)."""
    global _speed
    if s is not None:
        _speed = s
    return _speed

# ── Fill ─────────────────────────────────────────────────────────────────────

def begin_fill():
    """Start recording a filled polygon."""
    global _filling, _fill_path
    _filling = True
    _fill_path = [(_x, _y)]

def end_fill():
    """Close and fill the recorded polygon."""
    global _filling
    if _filling and len(_fill_path) >= 3:
        pts = [coord for tx, ty in _fill_path for coord in (_cx(tx), _cy(ty))]
        js._turtle_fill_polygon(json.dumps(pts), _fill_color)
    _filling = False
    _fill_path = []

# ── Position & heading ───────────────────────────────────────────────────────

def goto(x, y=None):
    """Move to (x, y).  Draws if pen is down."""
    global _x, _y
    if isinstance(x, (tuple, list)):
        x, y = x[0], x[1]
    if _pen_down:
        js._turtle_draw_line(_cx(_x), _cy(_y), _cx(x), _cy(y), _pen_color, _pen_width)
    _x, _y = float(x), float(y)
    if _filling:
        _fill_path.append((_x, _y))
    js._turtle_update_turtle(_x, _y, _heading, _visible, _pen_color)

setpos = goto
setposition = goto

def setx(x):
    """Set the turtle's x coordinate."""
    goto(x, _y)

def sety(y):
    """Set the turtle's y coordinate."""
    goto(_x, y)

def setheading(angle):
    """Set the turtle's heading to angle degrees (0=east, CCW positive)."""
    global _heading
    _heading = float(angle) % 360
    js._turtle_update_turtle(_x, _y, _heading, _visible, _pen_color)

seth = setheading

def home():
    """Move to origin (0,0) facing east."""
    goto(0.0, 0.0)
    setheading(0.0)

# ── Drawing shortcuts ────────────────────────────────────────────────────────

def circle(radius, extent=360, steps=None):
    """Draw a circle or arc.  Positive radius = left turn."""
    n = steps if steps else max(int(abs(radius) * abs(extent) * math.pi / 180 / 3), 12)
    step_angle = extent / n
    step_len = 2 * math.pi * abs(radius) * abs(extent) / 360 / n
    if radius < 0:
        step_angle = -step_angle
    for _ in range(n):
        forward(step_len)
        left(step_angle)

def dot(size=None, *args):
    """Draw a dot of given diameter (default: max(pensize+4, 2*pensize))."""
    d = size if size is not None else max(_pen_width + 4, _pen_width * 2)
    col = str(args[0]) if args else _pen_color
    js._turtle_draw_dot(_cx(_x), _cy(_y), d / 2, col)

def write(text, move=False, align='left', font=('Arial', 12, 'normal')):
    """Write text at the turtle's position."""
    family, size, *_ = font
    js._turtle_draw_text(_cx(_x), _cy(_y), str(text), _pen_color,
                         f'{size}px {family}', align)

# ── Visibility ───────────────────────────────────────────────────────────────

def hideturtle():
    """Hide the turtle cursor."""
    global _visible
    _visible = False
    js._turtle_update_turtle(_x, _y, _heading, _visible, _pen_color)

ht = hideturtle

def showturtle():
    """Show the turtle cursor."""
    global _visible
    _visible = True
    js._turtle_update_turtle(_x, _y, _heading, _visible, _pen_color)

st = showturtle

def isvisible():
    """Return True if the turtle is visible."""
    return _visible

# ── Query ────────────────────────────────────────────────────────────────────

def position():
    """Return current (x, y) as a tuple."""
    return (_x, _y)

pos = position

def xcor():
    """Return current x coordinate."""
    return _x

def ycor():
    """Return current y coordinate."""
    return _y

def heading():
    """Return current heading in degrees."""
    return _heading

def towards(x, y=None):
    """Return the angle from the turtle towards (x, y)."""
    if isinstance(x, (tuple, list)):
        x, y = x[0], x[1]
    return math.degrees(math.atan2(y - _y, x - _x)) % 360

def distance(x, y=None):
    """Return the distance from the turtle to (x, y)."""
    if isinstance(x, (tuple, list)):
        x, y = x[0], x[1]
    return math.hypot(x - _x, y - _y)

# ── Canvas / Screen dimensions ───────────────────────────────────────────────

def window_width():
    """Return the canvas width in pixels (equivalent to Screen().window_width())."""
    return js._turtle_canvas_width()

def window_height():
    """Return the canvas height in pixels (equivalent to Screen().window_height())."""
    return js._turtle_canvas_height()

def bgcolor(col):
    """Set the background colour of the canvas."""
    js._turtle_bgcolor(str(col))

def clear():
    """Clear the canvas but keep turtle position and settings."""
    js._turtle_clear()

def reset():
    """Reset all turtle state and clear the canvas."""
    global _x, _y, _heading, _pen_down, _pen_color, _fill_color
    global _pen_width, _speed, _visible, _filling, _fill_path
    _x = _y = 0.0
    _heading = 0.0
    _pen_down = True
    _pen_color = '#000000'
    _fill_color = '#000000'
    _pen_width = 1
    _speed = 6
    _visible = True
    _filling = False
    _fill_path = []
    js._turtle_reset()

# ── Compatibility stubs ───────────────────────────────────────────────────────

def done():
    """No-op — the canvas is always visible in the browser."""
    pass

mainloop = done
exitonclick = done

def title(s):
    """No-op — no separate window in browser mode."""
    pass

def setup(width=None, height=None, *args):
    """No-op — canvas size is fixed in the playground."""
    pass

def screensize(*args, **kwargs):
    pass

def tracer(*args, **kwargs):
    pass

def update():
    pass

def delay(*args):
    pass

def listen(*args, **kwargs):
    pass

def onkey(*args, **kwargs):
    pass

def onkeypress(*args, **kwargs):
    pass

def onkeyrelease(*args, **kwargs):
    pass

def onclick(*args, **kwargs):
    pass

def ontimer(*args, **kwargs):
    pass

def mode(*args, **kwargs):
    pass

# ── Screen class ──────────────────────────────────────────────────────────────

class _Screen:
    """Minimal Screen object for programs that use turtle.Screen()."""
    def bgcolor(self, col):
        bgcolor(col)
    def title(self, s):
        pass
    def setup(self, *args, **kwargs):
        pass
    def exitonclick(self):
        pass
    def mainloop(self):
        pass
    def tracer(self, *args, **kwargs):
        pass
    def update(self):
        pass
    def listen(self):
        pass
    def onkey(self, *args, **kwargs):
        pass
    def onkeypress(self, *args, **kwargs):
        pass
    def onkeyrelease(self, *args, **kwargs):
        pass
    def window_width(self):
        return window_width()
    def window_height(self):
        return window_height()

def Screen():
    """Return a Screen-compatible object."""
    return _Screen()

# ── Turtle class (OOP interface) ──────────────────────────────────────────────

class Turtle:
    """
    Object-oriented turtle interface.
    Each method delegates to the module-level procedural functions.
    Note: all Turtle instances share the same single canvas turtle.
    """
    def forward(self, d): forward(d)
    def fd(self, d): forward(d)
    def backward(self, d): backward(d)
    def bk(self, d): backward(d)
    def back(self, d): backward(d)
    def right(self, a): right(a)
    def rt(self, a): right(a)
    def left(self, a): left(a)
    def lt(self, a): left(a)
    def penup(self): penup()
    def pu(self): penup()
    def up(self): penup()
    def pendown(self): pendown()
    def pd(self): pendown()
    def down(self): pendown()
    def pencolor(self, *a): pencolor(*a)
    def fillcolor(self, *a): fillcolor(*a)
    def color(self, *a): color(*a)
    def begin_fill(self): begin_fill()
    def end_fill(self): end_fill()
    def goto(self, x, y=None): goto(x, y)
    def setpos(self, x, y=None): goto(x, y)
    def setposition(self, x, y=None): goto(x, y)
    def setx(self, x): setx(x)
    def sety(self, y): sety(y)
    def setheading(self, a): setheading(a)
    def seth(self, a): setheading(a)
    def home(self): home()
    def circle(self, r, e=360, s=None): circle(r, e, s)
    def dot(self, s=None, *c): dot(s, *c)
    def width(self, w=None): return width(w)
    def pensize(self, w=None): return width(w)
    def speed(self, s=None): return speed(s)
    def hideturtle(self): hideturtle()
    def ht(self): hideturtle()
    def showturtle(self): showturtle()
    def st(self): showturtle()
    def isvisible(self): return isvisible()
    def position(self): return position()
    def pos(self): return position()
    def xcor(self): return xcor()
    def ycor(self): return ycor()
    def heading(self): return heading()
    def towards(self, x, y=None): return towards(x, y)
    def distance(self, x, y=None): return distance(x, y)
    def write(self, t, **kw): write(t, **kw)
    def clear(self): clear()
    def reset(self): reset()
