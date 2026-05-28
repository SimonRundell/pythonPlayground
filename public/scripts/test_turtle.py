# Test script: Turtle Graphics
# Tests the custom canvas-based turtle implementation built into Python Playground.
# Expected output: colourful spiral pattern in the Graphics tab.

import turtle

turtle.speed(0)
turtle.width(2)

colours = ['red', 'orange', 'gold', 'lime green', 'royal blue', 'purple', 'deep pink']

# Spiral built from coloured squares
for i in range(70):
    turtle.color(colours[i % len(colours)])
    turtle.forward(i * 2.5)
    turtle.right(91)

turtle.hideturtle()
print("Turtle test complete — check the Graphics tab.")
print(f"  Position: {turtle.position()}")
print(f"  Heading:  {turtle.heading():.1f}°")
