# Test script: Matplotlib
# Install Matplotlib from the Packages button before running.
# NumPy is bundled automatically as a Matplotlib dependency.
# Expected output: line plot, bar chart and scatter plot in the Graphics tab.

import matplotlib.pyplot as plt
import numpy as np

fig, axes = plt.subplots(1, 3, figsize=(12, 4))
fig.suptitle('Matplotlib Test — Python Playground', fontsize=13, fontweight='bold')

# --- Line plot ---
x = np.linspace(0, 2 * np.pi, 200)
axes[0].plot(x, np.sin(x), 'b-',  label='sin(x)', linewidth=2)
axes[0].plot(x, np.cos(x), 'r--', label='cos(x)', linewidth=2)
axes[0].set_title('Line Plot')
axes[0].set_xlabel('x')
axes[0].legend()
axes[0].grid(True, alpha=0.3)

# --- Bar chart ---
categories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
values     = [34, 52, 41, 67, 59]
axes[1].bar(categories, values, color='steelblue', edgecolor='white')
axes[1].set_title('Bar Chart')
axes[1].set_ylabel('Count')

# --- Scatter plot ---
np.random.seed(42)
x2 = np.random.randn(80)
y2 = x2 * 1.5 + np.random.randn(80) * 0.6
axes[2].scatter(x2, y2, alpha=0.7, color='coral', edgecolors='white', linewidths=0.5)
axes[2].set_title('Scatter Plot')
axes[2].set_xlabel('x')
axes[2].set_ylabel('y')

plt.tight_layout()
plt.show()
print("Matplotlib test complete — check the Graphics tab.")
