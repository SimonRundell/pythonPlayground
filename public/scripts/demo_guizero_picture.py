# Demo: guizero Picture — displaying a PIL-generated image
#
# HOW TO USE THIS DEMO
# --------------------
# Install Pillow from the Packages button first, then click ▶ Run and
# switch to the GUI tab. Picture has no general image-upload UI (the
# workspace only accepts .py/.csv/.json), so it displays a PIL Image
# object built directly in code — the same way a script would show a
# chart or generated graphic without needing a file at all.

from PIL import Image, ImageDraw
from guizero import App, Picture

img = Image.new("RGB", (200, 120), "#f5f5f5")
draw = ImageDraw.Draw(img)
draw.rectangle([10, 10, 90, 90], fill="#8bc34a", outline="#33691e")
draw.ellipse([110, 10, 190, 90], fill="#ffd54f", outline="#f57f17")
draw.text((10, 95), "Made with Pillow", fill="#1a3a5c")

app = App(title="Picture demo", width=240, height=180, bg="#f5f5f5")
Picture(app, image=img)

app.display()
