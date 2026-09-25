# Demo: guizero Waffle — a clickable pixel grid
#
# HOW TO USE THIS DEMO
# --------------------
# Click ▶ Run, switch to the GUI tab, then click pixels to toggle them
# between white and blue. Click ⏹ Stop when you're done.

from guizero import App, Waffle

app = App(title="Waffle demo", width=260, height=300, bg="#f5f5f5")


def toggle_pixel(x, y):
    current = grid.get_pixel(x, y)
    grid.set_pixel(x, y, "white" if current == "blue" else "blue")


grid = Waffle(app, width=8, height=8, dim=24, pad=2, color="white", command=toggle_pixel)

app.display()
