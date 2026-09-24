# Demo: A simple guizero counter app
#
# HOW TO USE THIS DEMO
# --------------------
# Click ▶ Run, then switch to the GUI tab. Click the buttons to change the
# count. Click ⏹ Stop (on the GUI tab) to end the app and get back control
# of Run — a guizero app keeps running until it's stopped, same as it would
# on a desktop.
#
# guizero (https://lawsie.github.io/guizero/) is the same simplified GUI
# library taught in UK GCSE/KS3 Computer Science. This subset supports
# App, Box, Text and PushButton — real guizero tutorials using just those
# widgets will run here unmodified.

from guizero import App, Box, Text, PushButton

count = 0

app = App(title="Counter", width=300, height=180, bg="#f5f5f5")

display = Text(app, text="0", size=28)

buttons = Box(app, layout="grid")


def change(amount):
    global count
    count += amount
    display.value = str(count)


PushButton(buttons, command=change, args=[-1], text="-1", grid=[0, 0])
PushButton(buttons, command=change, args=[1], text="+1", grid=[1, 0])


def do_reset():
    global count
    count = 0
    display.value = "0"


PushButton(app, command=do_reset, text="Reset to 0")

app.display()

print("App stopped — count finished at", count)
