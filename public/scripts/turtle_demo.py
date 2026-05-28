import turtle
import random

def circle_eye(x, y, n, outer_radius):
    turtle.goto(x, y)
    turtle.circle(outer_radius)
    for i in range(n):
        turtle.goto(x, y)
        turtle.setheading(i / n * 360)
        turtle.penup()
        turtle.forward(outer_radius / 2)
        turtle.pendown()
        turtle.circle(outer_radius / 2)

def demo():
    turtle.speed(0)
    turtle.hideturtle()
    size = min(turtle.window_width(), turtle.window_height()) * 0.2
    turtle.color(random.choice(['red', 'royalblue', 'purple', 'teal']))
    circle_eye(0, 0, 16, size)

demo()
