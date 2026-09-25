"""
guizero.py — Browser-compatible subset of the guizero GUI library for Python Playground.

guizero (https://lawsie.github.io/guizero/) is the simplified GUI library taught in UK
GCSE/KS3 Computer Science, built on top of tkinter. Real tkinter needs an actual display
server and can't run in a browser tab, so this module reimplements the guizero API
directly against the DOM via Pyodide's JS bridge — code using the widgets below runs
unmodified against the real guizero.

Widget set so far: App, Box, Text, PushButton, TextBox, Drawing, Slider, Combo, ListBox,
"auto" and "grid" layouts.
Not yet implemented: Picture, Waffle, MenuBar, multiple windows.
Unsupported keyword arguments are accepted and silently ignored rather than raising, so
guizero tutorials using them don't hard-crash — they just have no effect. Drawing.image()
is a no-op stub — there's no image-loading pipeline in this playground.

Slider, Combo and ListBox all follow guizero's convention of calling command with the
widget's new value automatically — unlike PushButton/TextBox, no args= is needed.

License: Creative Commons BY-NC-SA 4.0 — Simon Rundell
"""
import json
import js  # Pyodide JS bridge
from pyodide.ffi import create_proxy

_NO_GRID = -1


def _grid_coords(grid):
    """Convert a guizero grid=[column, row] argument to (col, row) ints, or (-1, -1)."""
    if grid is None:
        return _NO_GRID, _NO_GRID
    return int(grid[0]), int(grid[1])


class App:
    """Top-level application window — the root container for all other widgets."""

    def __init__(self, title="guizero", width=500, height=500, layout="auto", bg=None, visible=True, **_kw):
        self._id = 'root'
        self.layout = layout
        self._title = title
        self._bg = bg
        js._gui_app_init(int(width), int(height), str(layout), bg)

    @property
    def title(self):
        return self._title

    @title.setter
    def title(self, value):
        # No visual effect — a browser tab has no separate window titlebar to update.
        self._title = value

    @property
    def bg(self):
        return self._bg

    @bg.setter
    def bg(self, value):
        self._bg = value
        js._gui_set_app_bg(value)

    async def display(self):
        """Block (cooperatively) until the app is stopped from the Stop button or destroy()."""
        await js._gui_await_stop()

    def destroy(self):
        """End the app immediately, as if the Stop button had been pressed."""
        js._gui_request_stop()


class Box:
    """A container widget that groups other widgets under its own layout."""

    def __init__(self, master, layout="auto", border=False, grid=None, **_kw):
        col, row = _grid_coords(grid)
        self.layout = layout
        self._id = js._gui_create_box(master._id, str(layout), bool(border), col, row)


class Text:
    """A read-only line of text."""

    def __init__(self, master, text="", size=10, color=None, font=None, align=None, grid=None, **_kw):
        col, row = _grid_coords(grid)
        self._text = str(text)
        self._id = js._gui_create_text(master._id, self._text, int(size), color, font, align, col, row)

    @property
    def value(self):
        return self._text

    @value.setter
    def value(self, text):
        self._text = str(text)
        js._gui_set_text(self._id, self._text)


class PushButton:
    """A clickable button that calls a Python function when pressed."""

    def __init__(self, master, command=None, args=None, text="Button", grid=None, **_kw):
        col, row = _grid_coords(grid)
        self._text = str(text)
        self._proxy = None
        if command is not None:
            def _on_click(*_ignored):
                command(*(args or ()))
            # create_proxy keeps the callback alive across multiple future clicks —
            # without it, Pyodide may garbage-collect an implicitly-converted proxy
            # as soon as this constructor returns.
            self._proxy = create_proxy(_on_click)
        self._id = js._gui_create_button(master._id, self._text, self._proxy, col, row)

    @property
    def text(self):
        return self._text

    @text.setter
    def text(self, value):
        self._text = str(value)
        js._gui_set_button_text(self._id, self._text)

    @property
    def enabled(self):
        return bool(js._gui_get_enabled(self._id))

    @enabled.setter
    def enabled(self, value):
        js._gui_set_enabled(self._id, bool(value))


class TextBox:
    """A single-line (or multiline) text entry field, with a live two-way .value."""

    def __init__(self, master, text="", command=None, args=None, width=None, height=None,
                 multiline=False, grid=None, **_kw):
        col, row = _grid_coords(grid)
        self._proxy = None
        if command is not None:
            def _on_change(*_ignored):
                command(*(args or ()))
            self._proxy = create_proxy(_on_change)
        self._id = js._gui_create_textbox(
            master._id, str(text), width, height, bool(multiline), self._proxy, col, row
        )

    @property
    def value(self):
        # Read live from the DOM rather than a cached copy — the student may have
        # typed since the last time Python touched this widget.
        return js._gui_get_text_value(self._id)

    @value.setter
    def value(self, text):
        js._gui_set_text_value(self._id, str(text))

    @property
    def enabled(self):
        return bool(js._gui_get_enabled(self._id))

    @enabled.setter
    def enabled(self, value):
        js._gui_set_enabled(self._id, bool(value))


class Drawing:
    """A canvas for direct drawing — lines, shapes and text."""

    def __init__(self, master, width=300, height=200, grid=None, **_kw):
        col, row = _grid_coords(grid)
        try:
            w = int(width)
        except (TypeError, ValueError):
            w = 300
        try:
            h = int(height)
        except (TypeError, ValueError):
            h = 200
        self._id = js._gui_create_drawing(master._id, w, h, col, row)

    def line(self, x1, y1, x2, y2, color="black", width=1):
        """Draw a straight line from (x1, y1) to (x2, y2)."""
        js._gui_drawing_line(self._id, x1, y1, x2, y2, str(color), int(width))

    def oval(self, x1, y1, x2, y2, color="black", outline=None):
        """Draw a filled oval inside the box bounded by (x1, y1) and (x2, y2)."""
        js._gui_drawing_oval(self._id, x1, y1, x2, y2, str(color), outline)

    def rectangle(self, x1, y1, x2, y2, color="black", outline=None):
        """Draw a filled rectangle with corners at (x1, y1) and (x2, y2)."""
        js._gui_drawing_rectangle(self._id, x1, y1, x2, y2, str(color), outline)

    def triangle(self, x1, y1, x2, y2, x3, y3, color="black", outline=None):
        """Draw a filled triangle through the three given points."""
        js._gui_drawing_polygon(self._id, json.dumps([x1, y1, x2, y2, x3, y3]), str(color), outline)

    def polygon(self, *coordinates, color="black", outline=None):
        """Draw a filled polygon through a flat list of x1, y1, x2, y2, ... points."""
        js._gui_drawing_polygon(self._id, json.dumps(list(coordinates)), str(color), outline)

    def text(self, x, y, text, color="black", size=10, font=None):
        """Draw text with its top-left corner at (x, y)."""
        js._gui_drawing_text(self._id, x, y, str(text), str(color), int(size), font)

    def image(self, *args, **kwargs):
        """Not supported — there's no image-loading pipeline in this playground."""
        pass

    def clear(self):
        """Clear everything drawn on this canvas."""
        js._gui_drawing_clear(self._id)


class Slider:
    """A draggable slider for picking a whole number in a range."""

    def __init__(self, master, start=0, end=100, horizontal=True, command=None,
                 width=None, height=None, grid=None, **_kw):
        col, row = _grid_coords(grid)
        self._proxy = None
        if command is not None:
            # guizero calls Slider's command with the new value as its one argument.
            self._proxy = create_proxy(command)
        self._id = js._gui_create_slider(
            master._id, int(start), int(end), bool(horizontal), self._proxy, col, row
        )

    @property
    def value(self):
        return js._gui_get_slider_value(self._id)

    @value.setter
    def value(self, v):
        js._gui_set_slider_value(self._id, int(v))

    @property
    def enabled(self):
        return bool(js._gui_get_enabled(self._id))

    @enabled.setter
    def enabled(self, value):
        js._gui_set_enabled(self._id, bool(value))


class Combo:
    """A dropdown list the student picks one option from."""

    def __init__(self, master, options=None, selected=None, command=None,
                 width=None, grid=None, **_kw):
        col, row = _grid_coords(grid)
        opts = [str(o) for o in (options or [])]
        self._proxy = None
        if command is not None:
            # guizero calls Combo's command with the newly selected value.
            self._proxy = create_proxy(command)
        self._id = js._gui_create_combo(
            master._id, json.dumps(opts),
            str(selected) if selected is not None else None,
            self._proxy, col, row
        )

    @property
    def value(self):
        return js._gui_get_combo_value(self._id)

    @value.setter
    def value(self, v):
        js._gui_set_combo_value(self._id, str(v))

    @property
    def enabled(self):
        return bool(js._gui_get_enabled(self._id))

    @enabled.setter
    def enabled(self, value):
        js._gui_set_enabled(self._id, bool(value))


class ListBox:
    """A scrollable list the student picks one (or more, with multiselect=True) items from."""

    def __init__(self, master, items=None, selected=None, command=None, multiselect=False,
                 width=None, height=None, grid=None, **_kw):
        col, row = _grid_coords(grid)
        opts = [str(i) for i in (items or [])]
        self._multiselect = bool(multiselect)
        self._proxy = None
        if command is not None:
            # guizero calls ListBox's command with the newly selected value
            # (a list of values when multiselect=True).
            self._proxy = create_proxy(command)
        sel = selected if selected is not None else []
        if not isinstance(sel, (list, tuple)):
            sel = [sel]
        self._id = js._gui_create_listbox(
            master._id, json.dumps(opts), json.dumps([str(s) for s in sel]),
            self._multiselect, width, height, self._proxy, col, row
        )

    @property
    def value(self):
        selected = list(js._gui_get_listbox_value(self._id))
        if self._multiselect:
            return selected
        return selected[0] if selected else None

    @value.setter
    def value(self, v):
        vals = v if isinstance(v, (list, tuple)) else [v]
        js._gui_set_listbox_value(self._id, json.dumps([str(x) for x in vals]))

    @property
    def enabled(self):
        return bool(js._gui_get_enabled(self._id))

    @enabled.setter
    def enabled(self, value):
        js._gui_set_enabled(self._id, bool(value))
