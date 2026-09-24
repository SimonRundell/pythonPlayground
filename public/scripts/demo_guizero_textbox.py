# Demo: guizero TextBox — live two-way text binding
#
# HOW TO USE THIS DEMO
# --------------------
# Click ▶ Run, switch to the GUI tab, and type a name into the box. The
# greeting updates on every keystroke via the TextBox's command= callback.
# Click ⏹ Stop when you're done.

from guizero import App, Text, TextBox

app = App(title="Greeter", width=300, height=150, bg="#f5f5f5")

Text(app, text="What's your name?")


def update_greeting():
    name = name_box.value.strip()
    greeting.value = f"Hello, {name}!" if name else "Hello, stranger!"


# name_box doesn't exist yet when update_greeting is defined above — that's
# fine, Python only looks it up when the callback actually runs, by which
# point it will exist as a module-level name.
name_box = TextBox(app, command=update_greeting, width=20)
greeting = Text(app, text="Hello, stranger!", size=14)

app.display()

print("App stopped — last name entered was:", name_box.value)
