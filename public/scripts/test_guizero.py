# Test script: guizero (Phase 1-3 combined)
# No packages need installing — guizero ships with the playground, like turtle.
# Exercises every widget added so far in one app: App, Box, Text, PushButton,
# TextBox, Drawing, both layout modes, live two-way binding, and a bound
# method used directly as a command=.
#
# HOW TO USE THIS TEST
# ---------------------
# Click ▶ Run, switch to the GUI tab, then:
#   1. Click +1 / -1 a few times — the counter should update.
#   2. Type into the text box — the greeting should update on every keystroke.
#   3. Click "Draw shapes" / "Clear canvas" — the canvas should draw/clear.
#   4. Click ⏹ Stop — the script should resume and print a summary.

from guizero import App, Box, Text, PushButton, TextBox, Drawing

app = App(title="guizero test", width=380, height=460, bg="#f5f5f5")

# ── Counter (PushButton, grid layout, command with args=) ──────────────────
count = 0
Text(app, text="Counter", size=14)
count_display = Text(app, text="0", size=24)

counter_buttons = Box(app, layout="grid")


def change_count(amount):
    global count
    count += amount
    count_display.value = str(count)


PushButton(counter_buttons, command=change_count, args=[-1], text="-1", grid=[0, 0])
PushButton(counter_buttons, command=change_count, args=[1], text="+1", grid=[1, 0])

# ── Live text binding (TextBox, command fires on every keystroke) ──────────
Text(app, text="Type your name:", size=14)


def update_greeting():
    name = name_box.value.strip()
    greeting.value = f"Hello, {name}!" if name else "Hello, stranger!"


name_box = TextBox(app, command=update_greeting, width=20)
greeting = Text(app, text="Hello, stranger!")

# ── Drawing (canvas shapes, a bound method used directly as command=) ──────
Text(app, text="Canvas", size=14)
canvas = Drawing(app, width=300, height=140)


def draw_shapes():
    canvas.clear()
    canvas.rectangle(10, 10, 90, 80, color="#8bc34a", outline="#33691e")
    canvas.oval(110, 10, 190, 80, color="#ffd54f", outline="#f57f17")
    canvas.triangle(220, 80, 260, 10, 300, 80, color="#e57373", outline="#b71c1c")
    canvas.line(10, 100, 300, 100, color="#333333", width=2)
    canvas.text(10, 110, "rectangle, oval, triangle, line", color="#1a3a5c", size=11)


canvas_buttons = Box(app, layout="grid")
PushButton(canvas_buttons, command=draw_shapes, text="Draw shapes", grid=[0, 0])
PushButton(canvas_buttons, command=canvas.clear, text="Clear canvas", grid=[1, 0])

draw_shapes()

app.display()

print("=" * 40)
print("  guizero test finished")
print("=" * 40)
print(f"  Final counter value : {count}")
print(f"  Last name entered   : {name_box.value or '(nothing typed)'}")
print("✓ If the GUI tab showed widgets, buttons responded, and the text box")
print("  updated live, the guizero bridge is working correctly.")
