# Test script: Pillow (PIL)
# Install Pillow from the Packages button before running.
# Expected output: generated image in the Graphics tab.
# Note: Pillow images are displayed via Matplotlib since the Playground's
# Graphics tab renders Matplotlib figures as PNG.

import PIL
from PIL import Image, ImageDraw, ImageFilter
import matplotlib.pyplot as plt
import numpy as np

print("=" * 40)
print(f"  Pillow {PIL.__version__} — functionality test")
print("=" * 40)

# --- Create a base image ---
WIDTH, HEIGHT = 500, 380
img = Image.new('RGB', (WIDTH, HEIGHT), color='#1a3a5c')
draw = ImageDraw.Draw(img)

# Background gradient effect (hand-rolled)
for y in range(HEIGHT):
    shade = int(26 + (y / HEIGHT) * 40)
    draw.line([(0, y), (WIDTH, y)], fill=(shade, shade + 20, shade + 60))

# --- Shapes ---
# Gold rectangle
draw.rectangle([20, 20, 180, 110], fill='#f0a500', outline='white', width=3)
draw.text((25, 25), "Rectangle", fill='#1a1a1a')

# Green ellipse
draw.ellipse([210, 20, 380, 110], fill='#27ae60', outline='white', width=3)
draw.text((240, 55), "Ellipse", fill='white')

# Red triangle
draw.polygon([(440, 110), (400, 20), (480, 20)], fill='#e74c3c', outline='white')
draw.text((408, 65), "Poly", fill='white')

# Blue circle row
for i, colour in enumerate(['#3498db', '#9b59b6', '#1abc9c', '#e67e22', '#e74c3c']):
    cx = 50 + i * 90
    draw.ellipse([cx - 30, 130, cx + 30, 190], fill=colour, outline='white', width=2)

# Text band
draw.rectangle([0, 210, WIDTH, 250], fill='#0d2136')
draw.text((20, 222), "Pillow image: shapes · filters · pixel access", fill='white')

# Checkerboard pattern
for row in range(7):
    for col in range(10):
        shade = '#ffffff' if (row + col) % 2 == 0 else '#1a3a5c'
        x0, y0 = col * 50, 260 + row * 17
        draw.rectangle([x0, y0, x0 + 49, y0 + 16], fill=shade)

# --- Pixel access ---
px = img.getpixel((50, 50))
print(f"\nImage size:         {img.size}")
print(f"Mode:               {img.mode}")
print(f"Pixel at (50, 50):  RGB{px}")

# --- Filter copy ---
blurred = img.filter(ImageFilter.GaussianBlur(radius=3))

# --- Display both with Matplotlib ---
fig, axes = plt.subplots(1, 2, figsize=(11, 4.5))
axes[0].imshow(img)
axes[0].set_title('Original image', fontweight='bold')
axes[0].axis('off')
axes[1].imshow(blurred)
axes[1].set_title('Gaussian blur (r=3)', fontweight='bold')
axes[1].axis('off')
fig.suptitle('Pillow (PIL) — functionality test', fontsize=12)
plt.tight_layout()
plt.show()

print("\n✓ Pillow test complete — check the Graphics tab.")
