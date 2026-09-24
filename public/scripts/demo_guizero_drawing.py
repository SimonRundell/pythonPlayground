# Demo: guizero Drawing — shapes and text on a canvas
#
# HOW TO USE THIS DEMO
# --------------------
# Click ▶ Run, then switch to the GUI tab. Click "Clear" to wipe the canvas
# and "Redraw" to draw the scene again — both call straight into the same
# Drawing methods a real guizero program would use.

from guizero import App, Box, PushButton, Drawing

app = App(title="Drawing demo", width=340, height=320, bg="#f5f5f5")

canvas = Drawing(app, width=300, height=220)


def draw_scene():
    canvas.clear()
    canvas.rectangle(10, 150, 290, 210, color="#8bc34a")          # grass
    canvas.rectangle(120, 90, 180, 150, color="#a1887f")          # house body
    canvas.triangle(105, 90, 195, 90, 150, 40, color="#e57373")   # roof
    canvas.oval(240, 20, 280, 60, color="#ffd54f")                # sun
    canvas.line(20, 210, 290, 210, color="#333333", width=2)      # ground line
    canvas.text(15, 15, "My House", color="#1a3a5c", size=16)


buttons = Box(app, layout="grid")
PushButton(buttons, command=draw_scene, text="Redraw", grid=[0, 0])
PushButton(buttons, command=canvas.clear, text="Clear", grid=[1, 0])

draw_scene()

app.display()
