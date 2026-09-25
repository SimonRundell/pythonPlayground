# Demo: guizero MenuBar — dropdown menus docked to the top of the app
#
# HOW TO USE THIS DEMO
# --------------------
# Click ▶ Run, switch to the GUI tab, then click "File" or "Edit" to open
# their dropdown menus and click an item. Click ⏹ Stop when done.

from guizero import App, Text, MenuBar

app = App(title="Menu demo", width=300, height=160, bg="#f5f5f5")

status = Text(app, text="Try the menu above")


def say(action):
    def _handler():
        status.value = f"You chose: {action}"
    return _handler


MenuBar(
    app,
    toplevel=["File", "Edit"],
    options=[
        [("New", say("New")), ("Open", say("Open")), None, ("Quit", say("Quit"))],
        [("Cut", say("Cut")), ("Copy", say("Copy")), ("Paste", say("Paste"))],
    ],
)

app.display()
