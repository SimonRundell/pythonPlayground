# Demo: guizero Slider, Combo and ListBox — a simple pizza order form
#
# HOW TO USE THIS DEMO
# --------------------
# Click ▶ Run, switch to the GUI tab, then move the slider, pick a size,
# tick some toppings (multiselect ListBox — ctrl/cmd-click for more than
# one) and click "Order" to see the summary update. Click ⏹ Stop when done.

from guizero import App, Text, Slider, Combo, ListBox, PushButton

app = App(title="Pizza order", width=320, height=420, bg="#f5f5f5")

Text(app, text="How many pizzas?", size=12)
quantity_label = Text(app, text="1", size=18)


def on_quantity_change(value):
    quantity_label.value = str(value)


quantity = Slider(app, start=1, end=10, command=on_quantity_change)

Text(app, text="Size", size=12)
size = Combo(app, options=["Small", "Medium", "Large"], selected="Medium")

Text(app, text="Toppings (select any number)", size=12)
toppings = ListBox(
    app,
    items=["Cheese", "Pepperoni", "Mushroom", "Pepper", "Olives", "Pineapple"],
    multiselect=True,
    height=5,
)

summary = Text(app, text="", size=12)


def place_order():
    chosen = toppings.value or ["(none)"]
    summary.value = (
        f"{quantity.value} x {size.value} pizza\nToppings: {', '.join(chosen)}"
    )


PushButton(app, command=place_order, text="Order")

app.display()

print("App stopped.")
