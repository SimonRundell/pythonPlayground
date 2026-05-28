# Test script: NumPy
# Install NumPy from the Packages button before running.
# Expected output: array operations and statistics printed to the Console.

import numpy as np

print("=" * 40)
print(f"  NumPy {np.__version__} — functionality test")
print("=" * 40)

# --- 1D array basics ---
a = np.array([4, 9, 1, 7, 3, 6, 2, 8, 5, 10])
print(f"\n1D array:  {a}")
print(f"  sorted:  {np.sort(a)}")
print(f"  min={a.min()}  max={a.max()}  mean={a.mean():.1f}  std={a.std():.2f}")

# --- Arithmetic broadcasting ---
b = np.arange(1, 6)
print(f"\nArange 1–5:  {b}")
print(f"  squared:   {b ** 2}")
print(f"  cumsum:    {np.cumsum(b)}")

# --- 2D matrix ---
M = np.array([[1, 2, 3],
              [4, 5, 6],
              [7, 8, 9]])
print(f"\n3×3 matrix:\n{M}")
print(f"  row sums:    {M.sum(axis=1)}")
print(f"  col sums:    {M.sum(axis=0)}")
print(f"  determinant: {np.linalg.det(M):.1f}")

# --- Trig & constants ---
angles = np.linspace(0, np.pi, 5)
print(f"\nAngles (0 → π): {angles.round(3)}")
print(f"  sin values:    {np.sin(angles).round(3)}")

# --- Random sampling ---
np.random.seed(0)
sample = np.random.normal(loc=50, scale=10, size=1000)
print(f"\nNormal sample (n=1000, μ=50, σ=10):")
print(f"  sample mean={sample.mean():.2f}, sample std={sample.std():.2f}")

print("\n✓ NumPy test complete.")
